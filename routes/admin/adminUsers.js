const express = require('express');
const router = express.Router();

const BillsController = require('../../controllers/BillsController');
const UsersController = require('../../controllers/UsersController');

router.get('/', async (req, res) => {
    const users = await UsersController.getAll();
    res.render('admin/users/index', {
        layout: 'admin/adminLayout',
        users
    });
});

router.get('/detail/:id', async (req, res) => {
    const id = req.params.id;
    const user = await UsersController.getById(id);
    const userBills = await BillsController.getByUserId(id);

    res.render('admin/users/detail', {
        layout: 'admin/adminLayout',
        user, 
        userBills
    });
})
router.get('/create', async (req, res) => {
    const id = req.params.id;

    res.render('admin/users/create', {
        layout: 'admin/adminLayout'
    });
})

module.exports = router;