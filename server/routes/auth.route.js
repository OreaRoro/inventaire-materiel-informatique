const express = require('express');
const route = express.Router();

const services = require('../services/AuthServices');

const AuthController = require('../controllers/AuthController');


/**
 * @description signup user
 * @method GET /signup
 */
route.get('/signup', services.signup);

/**
 * @description login user
 * @method GET /login
 */
route.get('/login', services.login);


//API AUTHENTICATION
route.post('/api/signup', AuthController.signup);
route.post('/api/login', AuthController.login);
route.get('/logout', AuthController.logout);


module.exports = route;