const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comments');
router.post('/comments', commentCtrl.createComment);
router.get('/comments', auth, commentCtrl.getComments);
router.delete('/comments/:id', auth, commentCtrl.deleteComment);

module.exports = router;