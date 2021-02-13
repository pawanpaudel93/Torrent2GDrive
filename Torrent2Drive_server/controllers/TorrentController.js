const express = require('express');
const axios = require('axios');
const router = express.Router();
const WebTorrent = require('webtorrent-hybrid');
const mime = require('mime-types');
const jwt = require('jsonwebtoken');
const {google} = require('googleapis');
const parseTorrent = require('parse-torrent')
const fs = require('fs');
const path = require('path');
const app = require('../server')
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./torrentStats');
const archiver = require('archiver');
// const rimraf = require("rimraf");

const opts = {
	connections: 1000,       // Max amount of peers to be connected to.
    uploads: 1,             // Number of upload slots.
    tmp:  './downloads',   // Root folder for the files storage.
                          // Defaults to '/tmp' or temp folder specific to your OS.
                         // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    path: './downloads',  // Where to save the files. Overrides `tmp`.
    verify: true,         // Verify previously stored data before starting
                          // Defaults to true
    dht: true,            // Whether or not to use DHT to initialize the swarm.
                          // Defaults to true
    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                          // Defaults to true
    trackers: []          // Allows to declare additional custom trackers to use
  };

var torrentClient = new WebTorrent(opts);
var torrentStats = {};


async function getTrackers() {
    try {
        response = await axios.get('https://newtrackon.com/api/stable')
        return await response.data.split(/[\r\n]+/).filter(e => e != '');
    } catch (error) {
        return [];
    }
}
(async () => {
    opts.trackers =  await getTrackers();
})()

const getStats = (req, res) =>{
    let stats;
    try {
        stats = localStorage.getItem(`${req.user.info.googleID}`);
        if (stats !== null) {
            stats = Object.values(JSON.parse(stats));
        } else {
            stats = [];
        }
    } catch (error) {
        stats = [];
    }
    return res.json(stats); 
};

const deleteStat = (req, res) =>{
    let infoHash = req.body.infoHash;
    let name = req.body.name;
    let stats = localStorage.getItem(`${req.user.info.googleID}`);
    if (stats !== null) {
        stats = JSON.parse(stats);
    } else {
        stats = {};
    }
    if (stats.hasOwnProperty(infoHash)) {
        delete stats[infoHash];
        // rimraf(`${path.dirname(__dirname)}/downloads/${name}`, function () { console.log("done"); });
        localStorage.setItem(`${req.user.info.googleID}`, JSON.stringify(stats));
    }
    return res.status(200).json({message: 'OK'});
};

const downloadUpload = async (req, torrent) => {
    let error = {};
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
        'access_token': req.user.accessToken
    });
    const drive = google.drive({version: 'v3', auth: oauth2Client});
    // for creating folders in google drive
    let folderID = req.body.folderID;
    var fileMetadata = {
        'name': torrent.name,
        'mimeType': 'application/vnd.google-apps.folder',
    };
    if (folderID !== 'Default') {
        fileMetadata.parents = [folderID];
    }
    drive.files.create({
        resource: fileMetadata,
        fields: 'id',
        supportsAllDrives: true,
    }, function (err, file) {
        if (err) {
        // Handle error
            error = {error: err.message};
        } else {
            // console.log('Folder Id: ', file.data.id);
            var folderId = file.data.id;
            // upload dwownloaded files
            if (req.body.doZip) {
                // zip downloaded files
                let uploadFolder = path.join('./downloads', torrent.name)
                let zipFile = path.join('./downloads', torrent.name + '.zip')

                var output = fs.createWriteStream(zipFile);
                var archive = archiver('zip', { zlib: { level: 9 } });
                archive.pipe(output);

                archive.directory(uploadFolder, torrent.name);
                archive.finalize();

                archive.on('error', function(err) {
                    // console.log(err);
                    error = {error: err.message}
                });

                output.on('close', () => { 
                    // console.log('Torrent Zipped successfully');
                    var fileMetadata = {
                        'name': zipFile,
                        parents: [folderId]
                    };
                    var media = {
                        mimeType: mime.lookup(zipFile),
                        body: fs.createReadStream(zipFile)
                    };
                    drive.files.create({
                        resource: fileMetadata,
                        media: media,
                        fields: 'id',
                        supportsAllDrives: true,
                    }, function (err, file) {
                        if (err) {
                        // Handle error
                        // console.error(err);
                            error = {error: err.message}
                        }
                        // console.log('File Id: ', file.data.id);
                    });
                });
            } else {
                torrent.files.forEach(function (file) {
                    var fileMetadata = {
                        'name': file.name,
                        parents: [folderId]
                    };
                    var media = {
                        mimeType: mime.lookup(file.name),
                        body: fs.createReadStream('./downloads/' + file.path)
                    };
                    drive.files.create({
                        resource: fileMetadata,
                        media: media,
                        fields: 'id',
                        supportsAllDrives: true,
                    }, function (err, file) {
                        if (err) {
                        // Handle error
                            // console.error(err);
                            error = {error: err.message}
                        }
                        // console.log('File Id: ', file.data.id);
                    });
                })
            }
        }
    });
    return error;
}

const downloadTorrent = async(req, res) => {
    let error = {};
    var magnetURI = req.body.magnet;
    try {
        parseTorrent(magnetURI)
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
    let torrent = torrentClient.get(magnetURI)

    if (torrent !== null) {
        error = await downloadUpload(req, torrent);
        if (Object.keys(error).length == 0) {
            let stats = {
                name: torrent.name,
                infoHash: torrent.infoHash,
                progress : '100%',
                timeRemaining : 0,
                downloaded : (torrent.length/(1024*1024)).toFixed(3) + ' MB',
                speed : (torrent.downloadSpeed/(1024*1024)).toFixed(3) + ' MB/sec',
                totalSize: (torrent.length/(1024*1024)).toFixed(3) + ' MB',
            }
            torrentStats[torrent.infoHash] = stats;
            localStorage.setItem(`${req.user.info.googleID}`, JSON.stringify(torrentStats));
        }
    } else {
        torrentClient.add(magnetURI, opts, (torrent) => {
            // Got torrent metadata!
            console.log('Client is downloading:', torrent.infoHash)
            // console.log('File is: ',torrent.files);
            // Print out progress every 5 seconds
            // console.log('File path is', file.path)
            var interval = setInterval(function () {
                torrent.resume();
                stats = {
                    name: torrent.name,
                    infoHash: torrent.infoHash,
                    progress : (torrent.progress * 100).toFixed(2) + '%',
                    timeRemaining : torrent.timeRemaining/1000,
                    downloaded : (torrent.downloaded/(1024*1024)).toFixed(3) + ' MB',
                    speed : (torrent.downloadSpeed/(1024*1024)).toFixed(3) + ' MB/sec',
                    totalSize: (torrent.length/(1024*1024)).toFixed(3) + ' MB',
                }
                torrentStats[torrent.infoHash] = stats;
                localStorage.setItem(`${req.user.info.googleID}`, JSON.stringify(torrentStats));
            }, 1000);
            torrent.on('done', async function () {
                clearInterval(interval);
                console.log('torrent download finished');
                // config google drive with client token
                error = await downloadUpload(req, torrent);
                if (Object.keys(error).length == 0) {
                    let stats = {
                        name: torrent.name,
                        infoHash: torrent.infoHash,
                        progress : '100%',
                        timeRemaining : 0,
                        downloaded : (torrent.length/(1024*1024)).toFixed(3) + ' MB',
                        speed : (torrent.downloadSpeed/(1024*1024)).toFixed(3) + ' MB/sec',
                        totalSize: (torrent.length/(1024*1024)).toFixed(3) + ' MB',
                    }
                    torrentStats[torrent.infoHash] = stats;
                    localStorage.setItem(`${req.user.info.googleID}`, JSON.stringify(torrentStats));
                }
            });
            torrentClient.on('error', function (err) {
                error = {error: err.message};
            });
        })
    }
    if (Object.keys(error).length !== 0) {
        return res.status(500).json(error)
    }
    return res.json({isFinished: true});
};

module.exports = {
    getStats: getStats,
    deleteStat: deleteStat,
    downloadTorrent: downloadTorrent
};