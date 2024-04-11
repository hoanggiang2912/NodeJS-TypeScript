const express = require('express');
const router = express.Router();

const CategoriesController = require('../../controllers/CategoriesController');

router.get('/', async (req, res) => {
    const categories = await CategoriesController.getAll();
    console.log(categories);
    res.render('admin/categories/index', { 
        categories, 
        layout: 'admin/adminLayout',
        title: 'Admin - Categories'
    });
});

router.get('/create', (req, res) => {
    res.render('admin/categories/create', { layout: 'admin/adminLayout' });
})

module.exports = router;