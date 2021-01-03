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

const opts = {
	connections: 1000,     // Max amount of peers to be connected to.
    uploads: 1,          // Number of upload slots.
    tmp:  './downloads',          // Root folder for the files storage.
                          // Defaults to '/tmp' or temp folder specific to your OS.
                          // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    path: './downloads', // Where to save the files. Overrides `tmp`.
    verify: true,         // Verify previously stored data before starting
                          // Defaults to true
    dht: true,            // Whether or not to use DHT to initialize the swarm.
                          // Defaults to true
    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                          // Defaults to true
    trackers: []
                          // Allows to declare additional custom trackers to use
                          // Defaults to empty
    
  };

var torrentClient = new WebTorrent(opts);

// function verifyToken(req, res, next) {
//     var token = req.header('auth-token');
//     if(!token) return res.status(401).send('Access Denied');
//     try {
//         token = jwt.verify(token, process.env.TOKEN_SECRET);
//         res.accessToken = token.accessToken;
//         next();
//     } catch {
//         res.status(400).send('Invalid Token');
//     }
// }

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

router.get('/stats', (req,res) =>{
    const stats = localStorage.getItem(`${req.user.googleID}`);
    res.json(stats); 
});

router.get('/finished', (req,res) => {
    const isFinished = localStorage.getItem('isFinished');
    res.json(isFinished);
});

router.post('/', (req, res) => {
    localStorage.clear();
    var magnetURI = req.body.magnet;
    try {
        parseTorrent(magnetURI)
    } catch (err) {
        res.status(500).json({error: err});
    }
    console.log(magnetURI);
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
                progress : (torrent.progress * 100).toFixed(2) + '%',
                timeRemaining : torrent.timeRemaining/1000,
                downloaded : (torrent.downloaded/(1024*1024)).toFixed(3) + ' MB',
                speed : (torrent.downloadSpeed/(1024*1024)).toFixed(3) + ' MB/sec',
                totalSize: (torrent.length/(1024*1024)).toFixed(3) + ' MB',
            }
            localStorage.setItem(`${req.user.googleID}`, JSON.stringify(stats));
        }, 1000);

        torrent.on('done', function () {
            clearInterval(interval);
            isFinished = {hasFinished: true}
            localStorage.setItem('isFinished', JSON.stringify(isFinished));
            console.log('torrent download finished');
            // config google drive with client token
            const oauth2Client = new google.auth.OAuth2()
            oauth2Client.setCredentials({
                'access_token': req.user.accessToken
            });
            const drive = google.drive({version: 'v3', auth: oauth2Client});
            // for creating folders in google drive
            var fileMetadata = {
                'name': torrent.name,
                'mimeType': 'application/vnd.google-apps.folder'
            };
            drive.files.create({
                resource: fileMetadata,
                fields: 'id'
            }, function (err, file) {
                if (err) {
                // Handle error
                console.error(err);
                } else {
                    console.log('Folder Id: ', file.data.id);
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
                            console.log(err);
                          });

                        output.on('close', () => { 
                            console.log('Torrent Zipped successfully'); 
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
                                console.error(err);
                                } else {
                                console.log('File Id: ', file.data.id);
                                }
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
                                console.error(err);
                                } else {
                                console.log('File Id: ', file.data.id);
                                }
                            });
                        })
                    }
                }
            });
            return res.json({finished: 'true'})
        });
    })
});

module.exports = router;