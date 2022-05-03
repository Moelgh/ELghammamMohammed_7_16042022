const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authAdmin = require('../middleware/authAdmin')
const postCtrl = require("../controllers/posts");
const multer = require('../middleware/multer-config');

router.post("/posts", auth, multer, postCtrl.createPost);
router.put("/posts/:id", auth, multer, postCtrl.updatePost);
router.delete("/posts/:id", auth, multer, postCtrl.deletePost);
router.get("/posts", auth, multer, postCtrl.getAllPosts);
router.get("/posts/:id", auth, postCtrl.getOnePost);
router.delete('/admin/delete/posts/:id', authAdmin, multer, postCtrl.adminDeletePost);

module.exports = router;