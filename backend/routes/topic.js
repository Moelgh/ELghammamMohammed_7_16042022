const express = require('express');

const router = express.Router();

const topicCtrl = require('../controllers/topic');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.get('/', auth, topicCtrl.getAllTopics);
router.get('/:id', auth, topicCtrl.getOneTopic);
router.post('/', auth, multer, topicCtrl.createTopic);
router.delete('/:id', auth, topicCtrl.deleteTopic);
router.put('/:id', auth, multer, topicCtrl.modifyTopic);

module.exports= router; 