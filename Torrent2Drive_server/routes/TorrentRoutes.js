const router = require('express').Router();
const {getStats, deleteStat, downloadTorrent} = require('../controllers/TorrentController');

router.get('/stats', getStats);
router.post('/stats', deleteStat);
router.post('/', downloadTorrent);

module.exports = router;