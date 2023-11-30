const { Router } = require('express');
const route = Router();
const multer = require('multer');
const {requireAuth, checkUser} = require('../middlewares/AuthMidleware');
const ProfileController = require('../controllers/ProfileController');
const ProfileService = require('../services/ProfileService');

// Storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/img/avatars');
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + (Math.random() + 1).toString(36).substring(7) + ext);
    }
})
let upload = multer({ storage: storage });

/**
 * @description profile
 * @method GET /profile
 */
route.get('/profile', requireAuth, checkUser, ProfileService.ProfileIndex);

// API PROFILE
route.put('/api/profile', upload.single('img'),requireAuth, ProfileController.update);

module.exports = route;