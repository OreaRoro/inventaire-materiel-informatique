const { Router } = require('express');
const route = Router();

const { requireAdmin, checkUser } = require('../middlewares/AuthMidleware');
const CategoryController = require('../controllers/CategoryController');
const CategoryService = require('../services/CategoryService');

/**
 * @description category
 * @method GET /category
 */
route.get('/category', requireAdmin, checkUser, CategoryService.CategoryIndex);

// API FOR CATEGORY
route.get('/api/category', CategoryController.find);
route.post('/api/category', requireAdmin, CategoryController.create);
route.put('/api/category', requireAdmin, CategoryController.update);
route.post('/api/confirm-delete-category', requireAdmin, CategoryController.confirmDeleteCategory);
route.delete('/api/category', requireAdmin, CategoryController.delete);

module.exports = route;