const  { Router } = require('express');
const route = Router();

const UserServices = require('../services/UserService');
const UserController = require('../controllers/UserController');
const {requireAdmin, checkUser} = require('../middlewares/AuthMidleware');

/**
 * @description user
 * @method GET /user
 */
route.get('/user', requireAdmin, checkUser, UserServices.UserIndex);

/**
 * @description add user
 * @method GET /user/add
 */
route.get('/user/add', requireAdmin, checkUser, UserServices.UserAdd);

/**
 * @description update user
 * @method GET /user/update
 */
route.get('/user/update', requireAdmin, checkUser, UserServices.UserUpdate);

// API FOR USER
route.get('/api/user', UserController.find);
route.post('/api/user', requireAdmin, UserController.create);
route.put('/api/user', requireAdmin, UserController.update);
route.delete('/api/user', requireAdmin, UserController.delete);

module.exports = route;