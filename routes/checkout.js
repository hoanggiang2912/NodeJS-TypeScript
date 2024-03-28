var express = require('express');
var router = express.Router();
const { checkoutValidator } = require('../validation.js');
const BillsModel = require('../models/BillsModel');
const BillsController = require('../controllers/BillsController');
const { ObjectId }  = require('mongoose').Types;

router.get('/', function (req, res, next) {
    const id = req.params.id;
    res.render('checkout', { title: 'Checkout', layout: false });
});

router.get('/shipping-payment/:idBill', async function (req, res, next) {
    const idBill = req.params.idBill;
    const bill = await BillsController.getById(idBill);
    
    res.render('shipping-payment', { title: 'Shipping & Payment', bill, layout: false });
});

router.get('/confirmation/:idBill', async function (req, res, next) {
    const idBill = req.params.idBill;
    const bill = await BillsController.getById(idBill);
    
    res.render('confirmation', { title: 'Confirmation', bill, layout: false });
});

router.post('/', async function (req, res) {
    const { error } = checkoutValidator(req.body);

    if (error) {
        return res.status(400).json({ errorMessage: error.details[0].message });
    }

    const bill = new BillsModel(req.body);

    try {
        const savedBill = await bill.save();
        res.json({ savedBill, bill, success: true });
    } catch (error) {
        // console.log(error);
        res.status(400).json({ errorMessage: error.message });
    }
});

module.exports = router;
