const express = require("express");
const cors = require("cors");

const app = express();
 
const path = require('path');

const userRoutes = require('./routes/user');
const topicRoutes = require('./routes/topic');
const commentRoutes= require('./routes/comment');
const postRoutes = require('./routes/post');

const corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    //Toutes les origines peuvent accéder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Ajoute les headers nécessaires aux requêtes envoyées à l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Permet d'envoyer les différentes requêtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

const db = require("./models");

db.sequelize.sync();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/post', postRoutes);

module.exports = app;