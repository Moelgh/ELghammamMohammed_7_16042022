const db = require("../models");
const Comment = db.comments;
const User = db.users;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
 
exports.createComment = (req, res) => {
    let topicId= req.body.topicId;
    let postId= req.body.postId;
    const comment = {
        userId: req.body.userId,
        topicId: req.body.topicId,
        postId: req.body.postId,
        content: req.body.content
    };
    if (topicId == null && postId == null) {
        res.status(400).json({ error: 'Ce n\'est pas la bonne section' })
    } else {
    Comment.create(comment)
        .then((data) => { 
            res.send(data); 
        })
        .catch((error) => {
            res.status(400).json({ error })
        });
    }
};

exports.getOneComment = (req, res) => {
    const id = req.params.id;
  
    Comment.findByPk(id)
        .then((comment) => {
            res.status(200).json(comment)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

exports.getAllComments = (req, res) => {
    const content = req.query.content;
    const condition = content ? { content: { [Op.like]: `%${content}%` } } : null;
  
    Comment.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
  };

    /*MODIFIE LE COMMENTAIRE
    *Contient deux branches 
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
    *La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé le commentaire
    */

exports.modifyComment = (req, res) => {
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
                Comment.update(req.body, { where: { id: id } } )
                    .then(() => {
                        res.status(200).json({ message: 'Commentaire modifié en tant qu\'administrateur !'})
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else { 
                Comment.findByPk(id)
                    .then(comment => {
                        if (comment.userId == userId) {
                            Comment.update(req.body, { where: { id: id } } )
                                .then(() => {
                                    res.status(200).json({ message: 'Commentaire modifié !'})
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

    /*SUPPRIME LE COMMENTAIRE
    *Contient deux branches 
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la suppression 
    *La seconde vérifie si l'utilisateur qui demande la suppression est bien celui qui a créé le topic
    */

exports.deleteComment = (req, res) => {
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
                Comment.destroy( { where: { id: id } } )
                    .then(() => {
                        res.status(200).json({ message: 'Commentaire supprimé en tant qu\'administrateur !'})
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else { 
                Comment.findByPk(id)
                    .then(comment => {
                        if (comment.userId == userId) {
                            Comment.destroy( { where: { id: id } } )
                                .then(() => {
                                    res.status(200).json({ message: 'Commentaire supprimé !'})
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

