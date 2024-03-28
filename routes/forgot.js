var express = require('express');
const sendMail = require('../mailer.js');
var router = express.Router();
const { emailValidator } = require('../validation.js');
const UsersController = require('../controllers/UsersController');
const UsersModel = require('../models/UsersModel.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.get('/', function (req, res, next) {
    res.render('forgot', { title: 'Forgot password' });
});

router.post('/',  async (req, res) => {
    const { error } = emailValidator(req.body);
    if (error) {
        return res.status(400).json({ errorMessage: error.details[0].message });
    }

    // Check if the user is already exist in the database
    const user = await UsersModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ errorMessage: `This email is not our customer yet!` });
    
    const email = req.body.email;
    const password = passwordGenerator(8);
    const updatedUser = await UsersController.updatePassword(user._id, password);
    // console.log(user, password);
    const info = await sendMail(email, {
        password
    });

    res.json({ sendMail: true, info, updatedUser });
});

const passwordGenerator = (passLength) => {
    const length = +passLength;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

module.exports = router;