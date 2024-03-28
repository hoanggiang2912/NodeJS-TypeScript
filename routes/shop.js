var express = require('express');
var router = express.Router();

const CategoriesController = require('../controllers/CategoriesController');
const ProductsController = require('../controllers/ProductsController')
const ProductsModel = require('../models/ProductsModel');

router.get('/', async function (req, res, next) {
    const categories = await CategoriesController.getAll();
    const amountProduct = await ProductsModel.countDocuments();
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    let pages = [];
    for (let i = 1; i <= Math.floor(amountProduct / 10) ; i++) {
        pages.push(i);
    }
    const products = await ProductsController.getAll({page ,limit});
    res.render('shop', {
        title: 'Equator Coffee - Shop',
        categoriesName: 'All',
        pages,
        categories,
        products
    });
});


router.get('/category/:idCategory', async function (req, res, next) {
    const id = req.params.idCategory;
    const categories = await CategoriesController.getAll();
    const category = categories.find(c => c._id == id);
    // console.log(category);

    // const products = await ProductsController.getAll();
    // const productsByCategory = products.filter(p => p.idCategory._id == id);
    const products = await ProductsController.getByIdCategory(id);
    // console.log(products);
    res.render('shop', {
        title: `Equator Coffee - ${category.name.toUpperCase()}`,
        categories,
        categoryName: category.name,
        category,
        products
    });
});

module.exports = router;
