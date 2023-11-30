const { Router } = require('express');
const route = Router();
const { requireAdmin, checkUser } = require('../middlewares/AuthMidleware');
const FonctionController = require('../controllers/FonctionController');
const FonctionServices = require('../services/FonctionService');

/**
 * @description fonction
 * @method GET /fonction
 */
route.get('/fonction', requireAdmin, checkUser, FonctionServices.FonctionIndex);



// API FONCTION
route.get('/api/fonction', FonctionController.find);
route.post('/api/confirm', FonctionController.confirmDelete);
route.post('/api/fonction', requireAdmin, FonctionController.create);
route.put('/api/fonction', requireAdmin, FonctionController.update);
route.delete('/api/fonction', requireAdmin, FonctionController.delete);

module.exports = route;