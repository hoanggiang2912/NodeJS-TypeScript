var express = require('express');
var router = express.Router();
const CategoiesController = require('../../controllers/CategoriesController');
const CategoriesModel = require('../../models/CategoriesModel');
const { json } = require('body-parser');
const {verify} = require('./verifyToken.js');


// get all categories
router.get('/', async (req, res, next) => {
    try {
        const categories = await CategoiesController.getAll();
        res.json(categories);
    } catch (error) {
        res.json({message: error})
    }
});

// submit a category
router.post('/', verify, async (req, res, next) => {
    const category = new CategoriesModel({
        name: req.body.name,
        banner: req.body.banner,
        description: req.body.description
    });

    try {
        const saveCateogory = await category.save();
        res.json({saveCateogory, success: true});
    } catch (error) {
        res.json({message: error});
    }
});

// get a specific category
router.get('/:id', async (req, res, next) => {
    try {
        const category = await CategoriesModel.findById(req.params.id);
        res.json(category);
    } catch (error) {
        res.json({message: error});
    }
});

// delete a specific category
router.delete('/:id', async (req, res) => {
    console.log('Deleting category with id:', req.params.id);
    try {
        const removedCategory = await CategoriesModel.deleteOne({_id: req.params.id});
        res.json(removedCategory);
    } catch (error) {
        console.error('Error deleting category:', error);
        res.json({message: error});
    }
});

// update a category 
router.patch('/:id' , async (req, res, next) => {
    // // Validate
    // const { error } = registerValidator(req.body);
    // if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    // }
    
    console.log('Updating category with id:', req.params.id);
    try {
        const updatedCategory = await CategoriesModel.updateOne(
            {_id: req.params.id}, 
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                }
            }
        )

        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.json({ message: error });
    }
})

module.exports = router;