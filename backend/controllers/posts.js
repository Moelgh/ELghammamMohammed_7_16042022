const fs = require('fs');
let db = require('../models');
const Post = db.Post
const User = db.User;
const getAuthUserId = require("../middleware/getAuthUserId");

exports.createPost = (req, res, next) => {
    if (!req.body.content) {
        res.status(400).send({
            message: "impossible de publier un message vide !"
        });
        return
    }
    if (req.file) {
        Post.create({
                userId: getAuthUserId(req),
                content: req.body.content,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            })
            .then(() => res.status(201).json({
                message: 'post créé !'
            }))
            .catch((error) => res.status(400).json({
                error,
                message: 'Vous ne pouvez pas publier un post'
            }))
    } else {
        Post.create({
                userId: getAuthUserId(req),
                content: req.body.content,
                imageUrl: null,
            })
            .then(() => res.status(201).json({
                message: 'post créé !'
            }))
            .catch((error) => res.status(400).json({
                error,
                message: 'Vous ne pouvez pas publier un post'
            }))
    }
}

exports.updatePost = (req, res, next) => {
    Post.findOne({

            where: {
                id: req.params.id
            }
        })
        .then(post => {
            if (post.userId !== getAuthUserId(req)) {
                return res.status(404).json({
                    error
                })
            };
            const postObject = req.file ? {
                ...req.body.post,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {
                ...req.body
            };
            Post.update({
                    ...postObject
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.status(200).json({
                    message: 'publication à jour !'
                }))
                .catch(error => res.status(400).json({
                    error
                }))
        });

};

exports.deletePost = (req, res, next) => {
    Post.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(post => {
            if (post.userId !== getAuthUserId(req)) {
                return res.status(404).json({
                    message: 'post introuvable'
                })
            };
            if (req.file) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    post.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(() => res.status(200).json({
                            message: 'le post est bien supprimé !'
                        }))
                        .catch(error => res.status(400).json({
                            error
                        }))
                })
            } else {
                post.destroy({
                        where: {
                            id: req.params.id
                        }
                    })
                    .then(() => res.status(200).json({
                        message: 'le post est bien supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }))
            }
        })
        .catch(error => res.status(500).json({
            error,
            message: 'impossible de supprimer le post !'
        }))
};

exports.getOnePost = (req, res, next) => {
   
    Post.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(post => res.status(200).json({
            post
        }))
        .catch(error => res.status(404).json({
            error,
            message: 'impossible de récupèrer un post'
        }))
};

exports.getAllPosts = (req, res, next) => {
   
    Post.findAll({
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'imageUrl']
            }],
        })
       
        .then(posts => res.status(200).json({
            posts
        }))
    
        .catch(error => res.status(400).json({
            error
        }))

};
exports.adminDeletePost = (req, res, next) => {
    Post.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(post => {
            if (req.file) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    post.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(() => res.status(200).json({
                            message: 'Vous avez supprimé la publication du user'
                        }))
                        .catch(error => res.status(400).json({
                            error
                        }))
                })
            } else {
                post.destroy({
                        where: {
                            id: req.params.id
                        }
                    })
                    .then(() => res.status(200).json({
                        message: 'Vous avez supprimé la publication du user'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }))
            }
        });
};