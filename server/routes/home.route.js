const express = require('express');
const route = express.Router();

const HomeController = require('../controllers/HomeController');
const services = require('../services/HomeService');
const { requireAuth, checkUser } = require('../middlewares/AuthMidleware');

/**
 * @description home
 * @method GET /
 */
route.get('/', requireAuth, checkUser, services.home);

// API FOR HOME
route.post('/chart', HomeController.dataChart);

module.exports = route;