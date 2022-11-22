const { validationResult } = require('express-validator')
const Post = require('../models/post')
const fs = require('fs');
const path = require('path');
const multer=require('multer')
const { v4: uuidv4 } = require('uuid');


exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalIteams;
    try {
        const totalIteams = await Post.findAndCountAll()
        const post = await Post.findAll({
            limit: perPage,
            offset: (currentPage - 1) * perPage
        })
        res.status(200).json({
            message: 'all post Fetched',
            posts: post,
            totalIteams: totalIteams
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findByPk(postId)
        .then(post => {
            if (!post) {
                const error = new Error('cound not find post');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Post fetched', post: post })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('your serverside validation is fail')
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('file uploaded fail');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const message = req.body.content;
    const post = new Post({
        title: title,
        content: message,
        imageUrl: imageUrl,
        creator: { name: 'Hiren' },
    })
    post.save()
        .then(result => {
            res.status(201).json({
                message: 'posts created succesfully',
                post: result
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('your serverside validation is fail')
        error.statusCode = 422;
        throw error;
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }

    if (!imageUrl) {
        const error = new Error('file uploaded fail');
        error.statusCode = 422;
        throw error;
    }
    console.log(postId);
    Post.findByPk(postId)
        .then(post => {
            if (!post) {
                const error = new Error('cound not find post');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save()
        })
        .then(result => {
            res.status(200).json({ message: 'Post updated', post: result })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findByPk(postId)
        .then(post => {
            if (!post) {
                const error = new Error('cound not find post');
                error.statusCode = 404;
                throw error;
            }
            clearImage(post.imageUrl);
            return Post.destroy({
                where: { id: postId },
                truncate: false
            });

        })
        .then(result => {
            console.log('deleted')
            res.status(200).json({ message: 'deleted' })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

const clearImage = filepath => {
    filepath = path.join(__dirname, '..', filepath)
    fs.unlink(filepath, err => console.log(err))
}

exports.array = (req, res, next) => {
    res.json(req.body);
}

// exports.image=(req,res,next)=>{
//     const fileStorage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, 'images');
//         },
//         filename: function (req, file, cb) {
//             cb(null, uuidv4())
//         }
//     })

// }