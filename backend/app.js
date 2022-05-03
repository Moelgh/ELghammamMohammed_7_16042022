const express = require('express'); 
const bodyParser = require('body-parser'); 
const mysql = require('mysql2');
const path = require("path");
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20 
});
const app = express(); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comment');

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());


app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

app.use(helmet());
app.use(limiter);

module.exports = app;