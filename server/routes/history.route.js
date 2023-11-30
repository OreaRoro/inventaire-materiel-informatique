const {Router} = require('express');
const route = Router();
const {requireAdmin,requireAuth, checkUser} = require('../middlewares/AuthMidleware');
const HistoryController = require('../controllers/HistoryController');
const HistoryService = require('../services/HistoryService');


/**
 * @description history
 * @method GET /history
 */
route.get('/history', requireAdmin, checkUser, HistoryService.HistoryIndex);

/**
 * @description retour
 * @method GET /retour
 */
route.get('/retour', requireAdmin, checkUser, HistoryService.Retour);

// API FOR HISTORY
route.get('/api/history', HistoryController.find);
route.get('/api/generatepdf-history', HistoryController.generatepdf);
route.get('/api/generatepdf-retour', HistoryController.generatepdfRetour);
route.post('/api/history', requireAuth, HistoryController.create);

module.exports = route;