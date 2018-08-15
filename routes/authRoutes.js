const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
    app.get('/', (req, res, next) => {
        res.send({ message: "Welcome to McMaster Health Sciences"});
    });

    app.get('/auth', requireAuth, (req, res, next) => {
        res.send({ message: 'Authenticated Route' })
    });

    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
};