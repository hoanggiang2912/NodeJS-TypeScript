var express = require('express');
var router = express.Router();

const UsersController = require('../controllers/UsersController');
const BillsController = require('../controllers/BillsController');

/* GET home page. */
router.get('/:id', async function (req, res) {
    const id = req.params.id;
    const user = await UsersController.getById(id);
    res.render('accountDetail', {
        title: 'Equator Coffee - Account Detail',
        user
    });
});

router.get('/order-history/:idUser', async (req, res) => {
    const id = req.params.idUser;
    const bills = await BillsController.getByUserId(id);

    res.render('userOrders', {
        title: 'Equator Coffee - Order History',
        bills
    })
})

router.get('/password/:id', async (req, res) => {
    const id = req.params.id;
    const user = await UsersController.getById(id);

    res.render('password', {
        title: 'Equator Coffee - Password',
        user
    })
})
router.patch('/password/:id', async (req, res) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const updatedUser = await UsersController.changePassword(id, { oldPassword, newPassword });
    const user = await UsersController.getById(id);

    if (updatedUser.message) {
        res.json({ message: updatedUser.message, updated: false })
    } else {
        res.json({ message: 'Password updated successfully' });
    }
})

module.exports = router;
