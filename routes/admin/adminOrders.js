const express = require('express');
const router = express.Router();

// const CategoriesController = require('../../controllers/CategoriesController');
const BillsController = require('../../controllers/BillsController');

router.get('/', async (req, res) => {
    const bills = await BillsController.getAll();
    res.render('admin/orders/index', {
        // categories,
        layout: 'admin/adminLayout',
        bills
    });
});

router.get('/detail/:id', async (req, res) => {
    const id = req.params.id;
    const bill = await BillsController.getById(id);
    
    res.render('admin/orders/detail', { 
        layout: 'admin/adminLayout',
        bill
    });
})

module.exports = router;