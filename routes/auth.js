const express = require('express');
const { body } = require('express-validator')
const User = require('../models/user');
const authController = require('../controller/auth');
const isauth = require('../middleware/is-auth');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please Enter a valid E-mail')
        .custom((value, { req }) => {
            return User.findOne({ where: { email: value } })
                .then(userDoc => {
                    if (userDoc) {
                        console.log(value)
                        return Promise.reject('This E-mail is already exists')
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .not()
        .isEmpty()
], authController.signUp);

router.post('/login', authController.login);

router.post('/register', authController.post)


module.exports = router;