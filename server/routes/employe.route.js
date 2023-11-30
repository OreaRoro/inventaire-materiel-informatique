const { Router } = require('express');
const route = Router();

const { requireAdmin, requireAuth, checkUser } = require('../middlewares/AuthMidleware');
const EmployeController = require('../controllers/EmployeController');
const EmployeServices = require('../services/EmployeService');

/**
 * @description employe
 * @method GET /employe
 */
route.get('/employe', requireAuth, checkUser, EmployeServices.EmployeIndex);

/**
 * @description add employe
 * @method GET /employe/add
 */
route.get('/employe/add', requireAdmin, checkUser, EmployeServices.EmployeAdd);

/**
 * @description update employe
 * @method GET /employe/update
 */
route.get('/employe/update', requireAdmin, checkUser, EmployeServices.EmployeUpdate);

// API EMPLOYE
route.get('/api/employe', EmployeController.find);
route.get('/api/Liste-Employe', EmployeController.generatepdf);
route.post('/api/employe', requireAdmin, EmployeController.create);
route.post('/api/confirm-delete-employe', requireAdmin, EmployeController.confirmDeleteEmploye);
route.put('/api/employe', requireAdmin, EmployeController.update);
route.delete('/api/employe', requireAdmin, EmployeController.delete);


module.exports = route;