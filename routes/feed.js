const express = require('express');
const { body } = require('express-validator');
const { ref } = require('joi');
const Joi = require('joi');
const multer = require('multer');
// const { regexp } = require('sequelize/types/lib/operators');
// const { regexp } = require('sequelize/types/lib/operators');
// const { isRegExp } = require('underscore');
const upload = multer({ dest: 'uploads/' }).array("demo");


const feedController = require('../controller/feed')
const isauth = require('../middleware/is-auth')

const router = express.Router();

router.get('/posts', isauth.isAuth, feedController.getPosts);

router.post('/post', [isauth.isAuth], [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })

], feedController.createPost);

router.get('/post/:postId', [isauth.isAuth], feedController.getPost);

router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })

], feedController.updatePost);

router.delete('/post/:postId', [isauth.isAuth], feedController.deletePost);

router.post("/image", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send("Something went wrong!");
        }
        res.json({ message: 'success' });
    });
});

router.post('/joi', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(5).required(),
        year: Joi.number().min(1992).max(2021).required(),
        email: Joi.string().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        conpass: Joi.string().equal(ref('password'))

    })
    const result = schema.validate(req.body)
    if (result.error) {
        res.status(422).send(result.error.details[0].message)
    }
    res.send(result);

})
module.exports = router;