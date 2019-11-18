const express = require('express');
const authRoutes = require('./routes/auth-routes');
const downloadRoutes = require('./routes/downloader_route');
const passportSetup = require('./auth_config/passport-setup');
const passport = require('passport')
const cookieSession = require('cookie-session')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())
app.use(cookieSession({
    keys: [process.env.SECRET]
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, './dist')));
app.use('/auth', authRoutes);
app.use('/download', downloadRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server has started on: '+ port);
})

module.exports = app;