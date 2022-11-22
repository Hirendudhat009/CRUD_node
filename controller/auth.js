const User = require('../models/user')

const { validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (!errors.isEmpty()) {
        const error = new Error('validation fail..!')
        error.statusCode = 422;
        throw error;
    }
    bcrypt.hash(password, 12)
        .then(hasedPassword => {
            const user = new User({
                email: email,
                password: hasedPassword,
                name: name
            })
            return user.save()
        })
        .then(result => {
            res.status(201).json({ message: 'user created', userId: result._id })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                const error = new Error('E-mail is not register')
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('wrong password')
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id
            }, 'somesupersecretsecret',
                { expiresIn: '1h' })
            res.status(200).json({ token: token, userId: loadedUser._id })
            // console.log(userId)
        })

        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })

}

exports.post = (req, res, next) => {
    console.log(req.body);
    res.status(200).json('sucess')
}