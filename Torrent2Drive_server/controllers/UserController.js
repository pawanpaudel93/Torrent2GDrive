const passport = require('passport')
const refresh = require('passport-oauth2-refresh');

//auth login

const authentication = passport.authenticate('google', {
    accessType: 'offline',
    scope: ['profile', 'https://www.googleapis.com/auth/drive.file', 'email']
});

const authenticationCallback =  (req, res) => {
    res.redirect('/download')
};

const getUser = (req, res) => {
    try {
        let user = {
            info: req.user.info,
            token: {
                access: {expiresIn: new Date().setHours(new Date().getHours() + 1)},
                refresh: {expiresIn: new Date().setDate(new Date().getDate() + 7)}
            }
        };
        res.json(user);
    } catch (err) {
        res.status(500).json({isAuthenticated: false});
    }
};

const refreshToken = (req, res) => {
    refresh.requestNewAccessToken('google', req.user.refreshToken, function(err, accessToken, refreshToken) {
        if (err) {
            res.status(500).json({"message": err.message})
        }
        let user = req.user
        user.accessToken = accessToken;
        console.log(refreshToken);
        req.logIn(user, function(err) {
            if (err) { return res.status(500).json({"message": err.message})}
            res.json({ expiresIn: new Date().setHours(new Date().getHours() + 1)})
        })
    });
}

const logout = (req, res) => {
    req.logOut();
    res.json({loggedOut: true});
};

module.exports = {
    authentication: authentication,
    authenticationCallback: authenticationCallback,
    getUser: getUser,
    refreshToken: refreshToken,
    logout: logout  
}