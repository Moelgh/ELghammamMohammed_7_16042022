const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin')
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/users');

router.post('/auth/signup', userCtrl.signup);
router.post('/auth/login', userCtrl.login);
router.get('/users/:id', auth, multer, userCtrl.getProfile);
router.get('/users', auth, userCtrl.getAllProfiles);
router.put('/users/:id', auth, multer, userCtrl.updateProfile);
router.delete('/users/:id', auth, multer, userCtrl.deleteProfile);
router.delete('/admin/delete/:id', authAdmin, multer, userCtrl.adminDeleteProfileUser);

module.exports = router;