const passport = require('passport')
const refresh = require('passport-oauth2-refresh');
const {google} = require('googleapis');

//auth login

const authentication = passport.authenticate('google', {
    accessType: 'offline',
    scope: ['profile', 'https://www.googleapis.com/auth/drive', 'email']
});

const authenticationCallback =  (req, res) => {
    res.redirect('/download')
};

const getUser = async (req, res) => {
    try {
        let drives = [{'name': 'Default', 'id': 'Default'}];
        let user = {
            info: req.user.info,
            token: {
                access: {expiresIn: new Date().setHours(new Date().getHours() + 1)},
                refresh: {expiresIn: new Date().setDate(new Date().getDate() + 7)}
            }
        };
        const oauth2Client = new google.auth.OAuth2()
        oauth2Client.setCredentials({
            'access_token': req.user.accessToken
        });
        const drive = google.drive({version: 'v3', auth: oauth2Client});
        const response = await drive.drives.list({});
        drives.push.apply(drives, response.data.drives)
        res.json({user: user, drives: drives});
    } catch (err) {
        res.status(500).json({isAuthenticated: false});
    }
};

const refreshToken = (req, res) => {
    try {
        refresh.requestNewAccessToken('google', req.user.refreshToken, function(err, accessToken, refreshToken) {
            if (err) {
                res.status(500).json({"message": err.message})
            }
            let user = req.user
            user.accessToken = accessToken;
            req.logIn(user, function(err) {
                if (err) { return res.status(500).json({"message": err.message})}
                res.json({ expiresIn: new Date().setHours(new Date().getHours() + 1)})
            })
        });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
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