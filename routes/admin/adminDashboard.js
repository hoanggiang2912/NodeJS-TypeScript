const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const verify = require('../apis/verifyToken.js');

const CategoriesController = require('../../controllers/CategoriesController');
const BillsController = require('../../controllers/BillsController');

router.get('/', async (req, res) => {
    // const categories = await CategoriesController.getAll();
    const bills = await BillsController.getAll();
    
    res.render('admin/dashboard', {
        layout: 'admin/adminLayout', 
        bills
    });
});

module.exports = router;