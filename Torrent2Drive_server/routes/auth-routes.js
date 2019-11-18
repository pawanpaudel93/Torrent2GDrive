const router = require('express').Router();
const passport = require('passport')
// const jwt = require('jsonwebtoken');

//auth login

router.get('/google-drive', passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/drive.file', 'email']
}));

router.get('/google-drive/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/download')
});

router.get('/user', (req, res) => {
    // let profile = req.user;
    // const token = jwt.sign({accessToken: profile.accessToken}, process.env.TOKEN_SECRET);
    try {
        let user = {
            name: req.user.name,
            googleID: req.user.googleID,
            email: req.user.email,
            avatar: req.user.avatar
            // accessToken: req.user.accessToken
        };
        // console.log(profile.accessToken)
        res.json(user);
    } catch (err) {
        res.status(500).json({isAuthenticated: false});
    }
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.json({loggedOut: true});
});

module.exports = router;