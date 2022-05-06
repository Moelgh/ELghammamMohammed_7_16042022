const db = require("../models");
const Topic = db.topics;
const User = db.users;
const Comment = db.comments;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
 
exports.createTopic = (req, res) => {
    const topic = {
        title: req.body.title,
        userId: req.body.userId
    };
    Topic.create(topic)
        .then((data) => { 
            res.send(data); 
        })
        .catch((error) => {
            res.status(400).json({ error })
        });
};

exports.getOneTopic = (req, res) => {
    const id = req.params.id;
  
    Topic.findByPk(id)
        .then((topic) => {
            res.status(200).json(topic)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

exports.getAllTopics = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    Topic.findAll({ where: condition , 
        order: [
            ['createdAt', 'DESC'],
        ]
    })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
  };

    /*MODIFIE LE TOPIC
    *Contient deux branches 
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
    *La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé le topic
    */

exports.modifyTopic = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;

    User.findByPk(userIdOrder)
        .then(user => {
            if(user.isAdmin == true && user.id == userId) {
                Topic.update(req.body, { where: { id: id } } )
                    .then(() => {
                        res.status(200).json({ message: 'Topic modifié en tant qu\'administrateur !'})
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else { 
                Topic.findByPk(id)
                    .then(topic => {
                        if (topic.userId == userId) {
                            Topic.update(req.body, { where: { id: id } } )
                                .then(() => {
                                    res.status(200).json({ message: 'Topic modifié!'})
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
                        }
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
};

    /*SUPPRIME LE TOPIC ET LES COMMENTAIRES LIES A CE TOPIC
    *Contient deux branches 
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la suppression 
    *La seconde vérifie si l'utilisateur qui demande la suppression est bien celui qui a créé le topic
    */

exports.deleteTopic = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;

    User.findByPk(userIdOrder)
        .then(user => {
            if(user.isAdmin == true && user.id == userId) {
                Topic.destroy( { where: { id: id } } )
                    .then(() => {
                        Comment.destroy( { where: { topicId: id } } )
                            .then(() => {
                                res.status(200).json({ message: 'Topic et commentaires supprimés en tant qu\'administrateur !'})
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
                
            } else { 
                Topic.findByPk(id)
                    .then(topic => {
                        if (topic.userId == userId) {
                            Topic.destroy( { where: { id: id } } )
                                .then(() => {
                                    Comment.destroy( { where: { topicId: id } } )
                                        .then(() => {
                                            res.status(200).json({ message: 'Topic et Commentaires supprimés!'})
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                            
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
                        }
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
};

