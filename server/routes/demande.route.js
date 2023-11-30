const { Router } = require('express');
const route = Router();
const { requireAuth, checkUser, requireAdmin} = require('../middlewares/AuthMidleware');
const DemandeController = require('../controllers/DemandeController');
const DemandeService = require('../services/DemandeService');

/**
 * @description demande
 * @method GET /demande
 */
route.get('/demande', requireAuth, checkUser, DemandeService.DemandeIndex);

// API FOR DEMANDE
route.get('/api/demande', DemandeController.find);
route.post('/api/demande', requireAuth, DemandeController.create);
route.post('/api/accept', requireAdmin, DemandeController.accept);
route.post('/api/cancel', requireAdmin, DemandeController.cancel);
route.post('/api/pending', requireAdmin, DemandeController.pending);
route.delete('/api/demande', requireAuth, DemandeController.delete);

module.exports = route;