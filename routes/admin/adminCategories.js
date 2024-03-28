const express = require('express');
const router = express.Router();

const CategoriesController = require('../../controllers/CategoriesController');

router.get('/', async (req, res) => {
    const categories = await CategoriesController.getAll();
    res.render('admin/categories/index', { 
        categories, 
        layout: 'admin/adminLayout' 
    });
});

router.get('/create', (req, res) => {
    res.render('admin/categories/create', { layout: 'admin/adminLayout' });
})

module.exports = router;