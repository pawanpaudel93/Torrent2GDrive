const passport = require('passport')
const GoogleDriveStrategy = require('passport-google-oauth20');
require('dotenv').config()
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new GoogleDriveStrategy({
        callbackURL: '/auth/google-drive/callback',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    }, (accessToken, refreshToken, profile, done) => {
        user = {
            name: profile.displayName,
            googleID: profile.id,
            email: profile._json.email,
            avatar: profile._json.picture,
            accessToken: accessToken
        }
        done(null, user);
    })
)