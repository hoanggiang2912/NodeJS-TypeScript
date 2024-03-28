var express = require('express');
var router = express.Router();

const ProductsController = require('../controllers/ProductsController');

router.get('/:id', async function (req, res, next) {
    const id = req.params.id;
    const product = await ProductsController.getById(id);
    console.log(product);
    res.render('singleProduct', { product });
});

module.exports = router;
