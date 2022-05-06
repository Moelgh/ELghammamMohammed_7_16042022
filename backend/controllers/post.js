const db = require("../models");
const Post = db.posts;
const User = db.users;
const Comment = db.comments;
const Op = db.Sequelize.Op;
const fs = require('fs');
const jwt = require('jsonwebtoken');
 
exports.createPost = (req, res) => {
    /*Déclaration de la variable image pour réceptionner le fichier du front*/
    let image;
    let title = req.body.title;
    if (req.file) {
        /*Récupération du fichier envoyé par le front dans la variable image avec multer*/
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } else {
        image == null
    };
    if (image == null || title == null) {
        res.status(400).json({ error: 'Rien à publier' })
    } else {
        const post = {
            userId: req.body.userId,
            title: title,
            /*La variable image est placée dans une instance de post*/
            imageUrl: image
        };
        Post.create(post)
            .then((data) => { 
                res.send(data); 
            })
            .catch((error) => {
                res.status(400).json({ error })
            });
    }
};

exports.getOnePost = (req, res) => {
    const id = req.params.id;
  
    Post.findByPk(id)
        .then((post) => {
            res.status(200).json(post)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

exports.getAllPosts = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    Post.findAll({ where: condition, 
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

    /*MODIFIE LA DESCRIPTION DU POST
    *Contient deux branches 
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
    *La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé le post
    */

exports.modifyPostDescription = (req, res) => {
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
                Post.update(req.body, { where: { id: id } } )
                    .then(() => {
                        res.status(200).json({ message: 'Post modifié!'})
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
            } else {
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            Post.update(req.body, { where: { id: id } } )
                                .then(() => {
                                    res.status(200).json({ message: 'Post modifié!'})
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

    /*MODIFIE L'IMAGE DU POST
    *Contient deux branches 
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
    *La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé le post
    *L'image existante est supprimée du fichier "images" et remplacée par la nouvelle
    */

exports.modifyPostPicture = (req, res) => {
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
                Post.findByPk(id)
                    .then(post => {
                        /*Déclaration de la variable image pour réceptionner le fichier du front*/
                        let image
                        if (req.file) {
                            /*Récupération du fichier envoyé par le front dans la variable image avec multer*/
                            image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        } else {
                            image == null;
                        };
                        if (image == null) {
                            res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                        } else {
                            //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                            const filename = post.imageUrl.split('/images/')[1];
                            //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                            fs.unlink(`images/${filename}`, () => {
                                const post = {
                                    /*La variable image est placée dans une instance de post*/
                                    imageUrl: image,
                                };
                                Post.update(post, { where: { id: id } } )
                                    .then(() => {
                                        res.status(200).json({ message: 'Photo modifiée en tant qu\'administrateur!' })
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
                            });
                        } 
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            } else {
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            /*Déclaration de la variable image pour réceptionner le fichier du front*/
                            let image
                            if (req.file) {
                                /*Récupération du fichier envoyé par le front dans la variable image avec multer*/
                                image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                            } else {
                                image == null;
                            }; 
                            if (image == null) {
                                res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                            } else {
                                //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                                const filename = post.imageUrl.split('/images/')[1];
                                //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                                fs.unlink(`images/${filename}`, () => {
                                const post = {
                                    /*La variable image est placée dans une instance de post*/
                                    imageUrl: image,
                                };
                                Post.update(post, { where: { id: id } } )
                                    .then(() => {
                                        res.status(200).json({ message: 'Photo modifiée !' })
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
                                });
                            }
                        } else {
                            res.status(401).json( { message: 'Opération non autorisée' } )
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

    /*SUPPRIME LE POST ET LES COMMENTAIRES LIES AU POST
    *Contient deux branches 
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la suppression
    *La seconde vérifie si l'utilisateur qui demande la suppression est bien celui qui a créé le post
    *Supprime également l'image du dossier "images"
    */

exports.deletePost = (req, res) => {
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
                Post.findByPk(id)
                    .then(post => {
                        //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                        const filename = post.imageUrl.split('/images/')[1];
                        //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                        fs.unlink(`images/${filename}`, () => {
                            Post.destroy( { where: { id: id } } )
                                .then(() => {
                                    Comment.destroy( { where: { postId: id } } )
                                        .then(() => {
                                            res.status(200).json({ message: 'Post et commentaires supprimés en tant qu\'administrateur !'})
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                        }); 
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            } else {
                Post.findByPk(id)
                    .then(post => {
                        if (post.userId == userId) {
                            //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                            const filename = post.imageUrl.split('/images/')[1];
                            //Utilisation de la fonction unlink pour supprimer l'image et suppression de tout le post et les comentaires du post
                            fs.unlink(`images/${filename}`, () => {
                                Post.destroy( { where: { id: id } } )
                                    .then(() => {
                                        Comment.destroy( { where: { postId: id } } )
                                            .then(() => {
                                                res.status(200).json({ message: 'Post et Commentaires supprimés !'})
                                            })
                                            .catch((error) => {
                                                res.status(400).json({ error })
                                            });
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
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