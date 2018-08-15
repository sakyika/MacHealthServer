const mongoose = require('mongoose');
const jwt = require('jwt-simple');

const config = require('../config/keys');

const UserModelClass = mongoose.model('users');

const userToken = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
    res.send({ token: userToken(req.user) });
}

exports.signup = (req, res, next) => {
    const { email } = req.body;
    const { password } = req.body;

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

        newUser.save( (err) => {
            res.json({ token: userToken(newUser) });
        });
    });
}