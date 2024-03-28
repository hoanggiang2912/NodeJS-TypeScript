const express = require('express');
const router = express.Router();

const CategoriesController = require('../../controllers/CategoriesController');
const ProductsController = require('../../controllers/ProductsController');

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CategoriesController.getOne(id);
        // console.log(category);
        const products = await ProductsController.getAll();
        // console.log(products);
        const categoryProducts = products.filter(p => p.idCategory._id == id);
        // console.log(categoryProducts);
        res.render('admin/categories/detail', {
            category,
            categoryProducts,
            layout: 'admin/adminLayout'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error while getting category detail!')
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const update = req.body;

    try {
        const updatedCategory = await CategoriesController.update(id, update);
        res.json(updatedCategory);
    } catch (error) {
        res.json({message: error});
    }
})

module.exports = router;