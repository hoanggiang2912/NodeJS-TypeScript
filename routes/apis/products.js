const express = require('express');
const router = express.Router();

const { addProductValidator, createProductValidator } = require('../../validation.js');
const ProductsModel = require('../../models/ProductsModel');
const ProductsController = require('../../controllers/ProductsController');

const {json} = require('body-parser');

// get all products
router.get('/', async (req, res, next) => {
    try {
        const queries = req.query;
        const products = await ProductsController.getAll(queries);
        res.json(products);
    } catch (error) {
        res.json({ message: error })
    }
});

// get a specific product
router.get('/:id', async (req, res, next) => {
    try {
        const product = await ProductsController.getById(req.params.id);
        res.json(product);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/category/:idCategory', async (req, res, next) => {
    try {
        const idCategory = req.params.idCategory;
        const product = await ProductsController.getByIdCategory(idCategory);
        res.json(product);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/:name', async (req, res, next) => {
    try {
        const name = req.params.name;
        const product = await ProductsController.getProductsByName(name);
        return product;
    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req, res) => {
    // Validate
    const { error } = createProductValidator(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    const product = new ProductsModel({
        idCategory: req.body.idCategory,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        salePrice: req.body.salePrice,
        background: req.body.background,
        qty: req.body.qty,
        thumbnails: req.body.thumbnails
    });

    try {
        const savedProduct = await product.save();
        res.json({savedProduct, success: true});
    } catch (error) {
        res.json({ message: error });
    }
});

// delete a specific product
router.delete('/:id', async (req, res) => {
    console.log('Deleting product with id:', req.params.id);
    try {
        const removedProduct = await ProductsModel.deleteOne({ _id: req.params.id });
        res.json({removedProduct, success: true});
    } catch (error) {
        console.error('Error deleting product:', error);
        res.json({ message: error });
    }
});

// update a product 
router.patch('/:id', async (req, res, next) => {
    console.log('Updating product with id:', req.params.id);
    try {
        const updatedProduct = await ProductsModel.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    price: req.body.price,
                    salePrice: req.body.salePrice,
                    description: req.body.description,
                    qty: req.body.qty,
                    idCategory: req.body.idCategory
                }
            }
        )

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.json({ message: error });
    }
})

// update product views
router.patch('/:id/views', async (req, res) => {
    console.log('Updating product views with id:', req.params.id);
    try {
        const updatedProduct = await ProductsModel.updateOne(
            { _id: req.params.id },
            {
                $inc: {
                    viewed: req.body.viewed
                }
            }
        )

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product views:', error);
        res.json({ message: error });
    }
});

module.exports = router;