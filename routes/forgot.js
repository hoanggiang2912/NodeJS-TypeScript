var express = require('express');
const sendMail = require('../mailer.js');
var router = express.Router();
const { emailValidator, passwordValidator, resetPasswordValidator } = require('../validation.js');
const UsersController = require('../controllers/UsersController');
const UsersModel = require('../models/UsersModel.js');
const jwt = require('jsonwebtoken');
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
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    const link = `/reset-password/${user._id}?token=${token}`;
    // const updatedUser = await UsersController.updatePassword(user._id, password);
    // console.log(user, password);
    const info = await sendMail(email, {
        link
    });

    res.json({ sendMail: true, info });
});

router.get('/reset-password/:idUser', async (req, res) => {
    const idUser = req.params.idUser;
    const token = req.query.token;

    const verify = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verify) return res.status(400).json({ errorMessage: 'Token is invalid' });

    res.render('resetPassword', { 
        title: 'Reset password', 
        idUser, 
        token 
    });
})

router.post('/reset-password/:idUser', async (req, res) => {
    try {
        const { error } = resetPasswordValidator(req.body);
        if (error) {
            return res.status(400).json({ errorMessage: error.details[0].message });
        }

        const idUser = req.params.idUser;
        const token = req.header('auth-token');

        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!verify) return res.status(400).json({ errorMessage: 'Token is invalid' });

        const password = req.body.password;

        const updatedUser = await UsersController.updatePassword(idUser, password);
        if (!updatedUser) return res.status(400).json({ errorMessage: 'Update user failed' });

        res.json({ updatedUser, success: true });
    } catch (error) {
        res.json({ errorMessage: error });
    }
})

// const passwordGenerator = (passLength) => {
//     const length = +passLength;
//     const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let password = '';
//     for (let i = 0; i < length; i++) {
//         password += charset.charAt(Math.floor(Math.random() * charset.length));
//     }
//     return password;
// }

module.exports = router;