const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

let uploadFolder = path.join('/home/pawan/Desktop/', 'Torrent2drive')
let zipFile = uploadFolder + '.zip'
console.log('zipfile is',zipFile)

var output = fs.createWriteStream(zipFile);
var archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);

archive.directory(uploadFolder, 'torrent.name');
archive.finalize();

output.on('close', () => { 
    console.log('Torrent Zipped successfully')
})