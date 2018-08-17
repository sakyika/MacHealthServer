const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const nodemailer = require('nodemailer');

const config = require('../config/baseConfig');

const UserModelClass = mongoose.model('users');

//const SERVER_ROOT_URL = "http://localhost:5000";
const SERVER_ROOT_URL = "https://nameless-hollows-27940.herokuapp.com";

const userToken = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'pj55xncdxkaztz7o@ethereal.email', // generated ethereal user
        pass: 'x3FfF2hgRDhQEpKJ16' // generated ethereal password
    }
});

const sendConfirmation = (args, emailToken) => {
    
    const confirmationUrl = `${SERVER_ROOT_URL}/confirmation/${emailToken}`;

    transporter.sendMail({
        to: args.email,
        subject: 'Confirm Email',
        html: `Please click this email to confirm your email: <a href="${confirmationUrl}">${confirmationUrl}</a>`,
    });
}

exports.signin = (req, res, next) => {
    res.send({ token: userToken(req.user) });
}

exports.signup = (req, res, next) => {
    const { email } = req.body;
    const { password } = req.body;

    console.log(`email: ${email}, password: ${password}`);

    if ( !email || !password) {
        return res.status(422).send({ error: 'You must provide email and password'});
    }

    UserModelClass.findOne({ email }, (err, existingUser) => {
        if (err) { return next(err); }

        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        const newUser = new UserModelClass({
            email,
            password
        });
/*
        newUser.save( (err) => {
            res.json({ token: userToken(newUser) });
        });
*/

    newUser.save( (err) => {
        res.json({ message: "Email confirmation sent!" });
    });

    sendConfirmation(newUser, userToken(newUser));

    });
}