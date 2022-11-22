const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const sequelize = require('./utils/database')
const dotenv = require('dotenv').config()

const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');


const app = express();
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname);
//     }
// })
const { v4: uuidv4 } = require('uuid');
const { Socket } = require('dgram');
// const fileStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function (req, file, cb) {
//         cb(null, uuidv4())
//     }
// })

app.use(bodyParser.json({}));//to use json data in body

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer({ storage: fileStorage }).single('image'));
app.use('/uploads', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

port = 2000;
console.log(dotenv)
console.log(app.get('env'))


app.use((error, req, res) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    // const data = error.data;
    res.status(status).json({ message: message });
    next();
})

sequelize.sync()
    .then(() => {
        app.listen(8080);
        // const io = require('socket.io')(server);
        // io.on('connection', socket => {
        //     console.log('Client Connected')
        // })
    })
    .then(err => {
        console.log(err);
    })



