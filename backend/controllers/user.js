const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    //Appelle de bcrypt qui hash le mot de passe et renvoie une promise
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = {
            email: req.body.email,
            password: hash,
            nom: req.body.nom,
            prenom: req.body.prenom,
        };
        User.create(user)
            .then(user => {
                res.status(200).json({
                    userId: user.id,
                    //Encode un nouveau token
                    token: jwt.sign(
                        { userId: user.id },
                        //Utilisation d'une chaîne de caractère temporaire
                        'RANDOM_TOKEN_SECRET',
                        //Durée de validité et demande de reconnection au bout de 24h
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch((error) => {
                res.status(400).json({ error })
            });
    })
    .catch((error) => {
        res.status(500).json({ error })
    });
};

exports.login = (req, res) => {
    const email = req.body.email;

    User.findOne({  where: { email: email } })
        .then(user => {
            /*Check si l'utilisateur existe*/
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            } 
            //S'il existe compare mot de passe entré et le hash de la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        //Encode un nouveau token
                        token: jwt.sign(
                            { userId: user.id },
                            //Utilisation d'une chaîne de caractère temporaire
                            'RANDOM_TOKEN_SECRET',
                            //Durée de validité et demande de reconnection au bout de 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error })
                });
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};

exports.getOneUser = (req, res) => {
    const id = req.params.id;
  
    User.findByPk(id)
        .then((user) => {
            res.status(200).json(user)
        })
        .catch((error) => {
            res.status(404).json({ error })
        });
};

    /*MODIFIE L'UTILISATEUR
    *Contient deux branches principales :
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
    *La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé l'utilisateur
    *Deux sous branches :
    *Check si l'utilisateur modifie son mot de passe
    *S'il modifie son mot de passe il va être hashé et toutes ses informations peuvent être modifiées sinon toutes les informations sauf le mot de passe seront modifiées
    */

exports.modifyUser = (req, res) => {
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
                if (!req.body.password) {
                User.update(req.body, { where: { id: id } } )
                    .then(() => {
                        res.status(200).json({ message: 'Utilisateur modifié!' })
                    })
                    .catch((error) => {
                        res.status(400).json({ error })
                    });
                } else {
                    //Appelle de bcrypt qui hash le mot de passe et renvoie une promise
                    bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = {
                            email: req.body.email,
                            password: hash,
                            nom: req.body.nom,
                            prenom: req.body.prenom,
                            poste: req.body.poste,
                            biographie: req.body.biographie,
                        };
                        User.update(user, { where: { id: id } } )
                            .then(() => {
                                res.status(200).json({ message: 'Mot de passe modifié!' })
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                    })
                    .catch((error) => {
                      res.status(500).json({ error })
                    });
                            }
            } else {
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            if (!req.body.password) {
                            User.update(req.body, { where: { id: id } } )
                                .then(() => {
                                    res.status(200).json({ message: 'Utilisateur modifié!' })
                                })
                                .catch((error) => {
                                    res.status(400).json({ error })
                                });
                            } else {
                                bcrypt.hash(req.body.password, 10)
                                .then(hash => {
                                    const user = {
                                        email: req.body.email,
                                        password: hash,
                                        nom: req.body.nom,
                                        prenom: req.body.prenom,
                                        poste: req.body.poste,
                                        biographie: req.body.biographie,
                                    };
                                    User.update(user, { where: { id: id } } )
                                        .then(() => {
                                            res.status(200).json({ message: 'Mot de passe modifié!' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                })
                                .catch((error) => {
                                    res.status(500).json({ error })
                                });
                            }
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' } )
                        
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};

    /*MODIFIE L'IMAGE DE L'UTILISATEUR
    *Contient deux branches principales :
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la modification 
    *La seconde vérifie si l'utilisateur qui demande la modification est bien celui qui a créé l'utilisateur
    *Deux sous branches :
    *Check si l'utilisateur a une photo de profil ou non
    *Si une image existe déjà elle est supprimée du fichier "images" et remplacée par la nouvelle sinon la nouvelle image est simplement créée
    */

exports.modifyUserPicture = (req, res) => {

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
                        let image
                        if (req.file) {
                            image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        } else {
                            image == null;
                        }; 
                        if (image == null) {
                            res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                        } else {
                            if (user.imageUrl != null) {
                                //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                                const filename = user.imageUrl.split('/images/')[1];
                                //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                                fs.unlink(`images/${filename}`, () => {
                                    const user = {
                                        imageUrl: image,
                                    };
                                    User.update(user, { where: { id: id } } )
                                        .then(() => {
                                            res.status(200).json({ message: 'Photo modifiée en tant qu\'administrateur!' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                });
                            } else {
                                const user = {
                                    imageUrl: image,
                                };
                                User.update(user, { where: { id: id } } )
                                    .then(() => {
                                        res.status(200).json({ message: 'Photo modifiée en tant qu\'administrateur!' })
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
                            }   
                        }
            } else {
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            let image
                            if (req.file) {
                                image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                            } else {
                                image == null;
                            }; 
                            if (image == null) {
                                res.status(400).json({ error: 'Vous n\'avez pas chargé l\'image !' })
                            } else {
                                if (user.imageUrl != null) {
                                    //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                                    const filename = user.imageUrl.split('/images/')[1];
                                    //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                                    fs.unlink(`images/${filename}`, () => {
                                        const user = {
                                            imageUrl: image,
                                        };
                                        User.update(user, { where: { id: id } } )
                                            .then(() => {
                                                res.status(200).json({ message: 'Photo modifiée !' })
                                            })
                                            .catch((error) => {
                                                res.status(400).json({ error })
                                            });
                                    });
                                } else {
                                    const user = {
                                        imageUrl: image,
                                    };
                                    User.update(user, { where: { id: id } } )
                                        .then(() => {
                                            res.status(200).json({ message: 'Photo modifiée !' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                }   
                            }
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' } )
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};

    /*SUPPRIME L'UTILISATEUR
    *Contient deux branches principales :
    *La première vérifie si l'utilisateur est administrateur grâce au userIdOrder envoyé par le front puis lance la suppression
    *La seconde vérifie si l'utilisateur qui demande la suppression est bien celui qui a créé l'utilisateur
    *Deux sous branches :
    *Check si l'utilisateur a une photo de profil ou non
    *Si une image existe déjà elle est supprimée du fichier "images" puis l'utilisateur est supprimé sinon seul l'utilisateur est supprimé
    */

exports.deleteUser = (req, res) => {
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
                if(user.imageUrl != null) {
                    //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                    const filename = user.imageUrl.split('/images/')[1];
                    //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                    fs.unlink(`images/${filename}`, () => {
                        User.destroy( { where: { id: id } } )
                            .then(() => {
                                res.status(200).json({ message: 'Utilisateur supprimé!'})
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                    });
                } else {
                    User.destroy( { where: { id: id } } )
                        .then(() => {
                            res.status(200).json({ message: 'Utilisateur supprimé!'})
                        })
                        .catch((error) => {
                            res.status(400).json({ error })
                        });
                    }
            } else {
                User.findByPk(id)
                    .then(user => {
                        if (user.id == userId) {
                            if(user.imageUrl != null) {
                                //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
                                const filename = user.imageUrl.split('/images/')[1];
                                //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                                fs.unlink(`images/${filename}`, () => {
                                    User.destroy( { where: { id: id } } )
                                        .then(() => {
                                            res.status(200).json({ message: 'Utilisateur supprimé!'})
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error })
                                        });
                                });
                            } else {
                                User.destroy( { where: { id: id } } )
                                    .then(() => {
                                        res.status(200).json({ message: 'Utilisateur supprimé!'})
                                    })
                                    .catch((error) => {
                                        res.status(400).json({ error })
                                    });
                            }
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
};

exports.getAllUsers = (req, res) => {
    const email = req.query.email;
    const condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
  
    User.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).json({ error })
        });
  };