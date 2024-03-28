var express = require('express');
var router = express.Router();

const CategoriesController = require('../controllers/CategoriesController');
const ProductsControllers = require('../controllers/ProductsController');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const categories = await CategoriesController.getAll();
  // const products = await ProductsControllers.getAll();
  const recentProducts = await ProductsControllers.getRecentProducts(4);
  const mostViewsProduct = await ProductsControllers.getProductsByViews(4);
  
  res.render('index', { 
    title: 'Equator Coffee - Home',
    recentProducts,
    mostViewsProduct,
    categories
  });
});

module.exports = router;
