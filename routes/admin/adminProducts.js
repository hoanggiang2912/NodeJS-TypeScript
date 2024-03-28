const express = require('express');
const router = express.Router();

const ProductsController = require('../../controllers/ProductsController');
const CategoriesController = require('../../controllers/CategoriesController');

router.get('/', async (req, res) => {
    const products = await ProductsController.getAll();
    res.render('admin/products/index', {
        products,
        layout: 'admin/adminLayout'
    });
});

router.get('/create', async (req, res) => {
    const categories = await CategoriesController.getAll(); 
    res.render('admin/products/create', { 
        categories,
        layout: 'admin/adminLayout' 
    });
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await ProductsController.getById(id);
    // console.log(product);
    const categories = await CategoriesController.getAll();
    
    res.render('admin/products/detail', {
        product,
        categories,
        layout: 'admin/adminLayout'
    });
})

module.exports = router;