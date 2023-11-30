const {Router} = require('express');
const route = Router();
const multer = require('multer');

const { requireAdmin,requireAuth, checkUser } = require('../middlewares/AuthMidleware');
const MaterielController = require('../controllers/MaterielController');
const MaterielService = require('../services/MaterielService');

// Storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/img/materiel');
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + (Math.random() + 1).toString(36).substring(7) + ext);
    }
})
let upload = multer({ storage: storage });

/**
 * @description materiel
 * @method GET /materiel
 */
route.get('/materiel', requireAuth, checkUser, MaterielService.MaterielIndex);

/**
 * @description add materiel
 * @method GET /materiel/add
 */
route.get('/materiel/add', requireAdmin, checkUser, MaterielService.MaterielAdd);

/**
 * @description update materiel
 * @method GET /materiel/update
 */
route.get('/materiel/update', requireAdmin, checkUser, MaterielService.MaterielEdit);

/**
 * @description used materiel
 * @method GET /materiel/use
 */
route.get('/materiel/use', requireAdmin, checkUser, MaterielService.MaterielInUse);

// API FOR MATERIEL
route.get('/api/materiel', MaterielController.find);
route.post('/api/materiel', upload.single('img'), requireAdmin, MaterielController.create);
route.post('/api/confirm-delete-materiel', requireAdmin, MaterielController.confirmDeleteMateriel);
route.post('/api/return', requireAdmin, MaterielController.returnedMateriel);
route.put('/api/materiel',  upload.single('img'), requireAdmin, MaterielController.update);
route.delete('/api/materiel', requireAdmin, MaterielController.delete);

module.exports = route;