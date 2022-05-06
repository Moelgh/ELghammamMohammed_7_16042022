const express = require('express');

const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.post('/', auth, multer, commentCtrl.createComment);
router.delete('/:id', auth, commentCtrl.deleteComment);
router.put('/:id', auth, multer, commentCtrl.modifyComment);
router.get('/', auth, commentCtrl.getAllComments);
router.get('/:id', auth, commentCtrl.getOneComment);

module.exports = router; 