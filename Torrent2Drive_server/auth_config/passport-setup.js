const passport = require('passport')
const GoogleDriveStrategy = require('passport-google-oauth20');
const refresh = require('passport-oauth2-refresh');
require('dotenv').config()

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const strategy = new GoogleDriveStrategy({
    callbackURL: '/auth/google-drive/callback',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
    user = {
        info: {
            name: profile.displayName,
            googleID: profile.id,
            email: profile._json.email,
            avatar: profile._json.picture,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
    }
    done(null, user);
})

passport.use(strategy)
refresh.use(strategy)