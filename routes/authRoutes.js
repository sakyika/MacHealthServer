const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const config = require('../config/baseConfig');

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false });

const UserModelClass = mongoose.model('users');

module.exports = (app) => {
    app.get('/', (req, res, next) => {
        res.send({ message: "Welcome to McMaster Health Sciences"});
    });

    app.get('/auth', requireAuth, (req, res, next) => {
        res.send({ message: 'Authenticated Route' })
    });

    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
    
    app.get('/confirmation/:token', (req, res, next) => {

        const { sub } = jwt.decode(req.params.token, config.secret);


    UserModelClass.update({ _id: sub }, { $set: { confirmed: true }}, function (err, user) {
    
        if(err) { console.log("****** There was an error *******"); return next(err); }

    });


        return res.redirect('http://localhost:3000/signin');

      });
};