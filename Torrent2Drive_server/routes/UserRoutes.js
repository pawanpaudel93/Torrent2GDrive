const router = require('express').Router();
const passport = require('passport');
const {authentication, authenticationCallback, getUser, refreshToken, logout} = require('../controllers/UserController');

//auth login

router.get('/google-drive', authentication);
router.get('/google-drive/callback', passport.authenticate('google'), authenticationCallback);
router.get('/user', getUser);
router.get("/refresh", refreshToken);
router.get('/logout', logout);

module.exports = router;