const express = require('express');
const router = express.Router();
const Users = require('../../models/UsersModel.js');
const jwt = require('jsonwebtoken');
const { loginValidator, registerValidator, updateProfileValidator, adminUserUpdateValidator, createUserValidator } = require('../../validation.js');
const bcrypt = require('bcryptjs');
const UsersModel = require('../../models/UsersModel.js');
const UsersController = require('../../controllers/UsersController.js');
const {verify} = require('./verifyToken.js');

// /api/v1/auth

router.post('/check-token', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        if (verify) {
            res.json({ success: true });
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({success: false, message: 'Token expired'});
        } else {
            res.status(403).json({success: false, message: 'Forbidden'});
        }
    }
})

router.post ('/refresh', (req, res) => {
    const refreshToken = req.headers.authorization.split(' ')[1];
    if (refreshToken == null) return res.status(401).json({message: 'Unauthorized'});

    jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({message: 'Forbidden'});

        const authToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: 60 * 30});
        res.json({authToken});
    })
})

router.get('/', async (req, res, next) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        res.json({message: error});
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.json({message: error});
    }
})

router.post('/register', async (req, res, next) => {
    // Validate
    const {error} =  registerValidator(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    // Check if the user is already exist in the database
    const existUser = await Users.findOne({email: req.body.email});
    if (existUser) return res.status(400).json({message: 'Email already exists'});
    
    // Hass password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // Create new user
    const user = new Users({
        password: hashedPassword,
        email: req.body.email,
        phone: req.body.phone
    })

    try {
        const savedUser = await user.save();
        res.json({savedUser, success: true});
    } catch (error) {
        console.log(error);
        res.json({message: error});
    }
});

router.post('/create', async (req, res, next) => {
    // Validate
    const { error } = createUserValidator(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    // Check if the user is already exist in the database
    const existUser = await Users.findOne({email: req.body.email});
    if (existUser) return res.status(400).json({message: 'Email already exists'});
    
    // Hass password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // Create new user
    const user = new Users({
        password: hashedPassword,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        note: req.body.note
    })

    try {
        const savedUser = await user.save();
        res.json({savedUser, success: true});
    } catch (error) {
        console.log(error);
        res.json({message: error});
    }
});

router.post('/login', async (req ,res) => {
    // Validate
    const { error } = loginValidator(req.body);
    if (error) return res.status(400).json({message: error.details[0].message});
    // check if the email exist
    const user = await UsersModel.findOne({email: req.body.email});
    if (!user) return res.status(400).json({ message: 'Email or password is incorrect!'});

    // check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Email or password is incorrect!'});

    // create and assign a token
    const authToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: 60 * 5});
    const refreshToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: 60 * 60 * 24 * 365});

    res.header('Authorization', authToken).send({
        refreshToken,
        authToken,
        user
    });
});

router.patch('/update-profile/:idUser', async (req, res) => {
    try {
        const idUser = req.params.idUser;
        await UsersModel.updateOne(
            {
                _id: idUser
            },
            {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    addresses: [
                        {
                            address: req.body.address,
                            addressDetail: req.body.addressDetail
                        }
                    ]
                }
            }
        );
        const updatedUser = await UsersModel.findById(idUser);

        res.status(200).json({ updatedUser, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/update-user-admin/:idUser', async (req, res) => {
    const {error} = adminUserUpdateValidator(req.body);

    if (error) {
        return res.status(400).json({errorMessage: error.details[0].message});
    }
    
    try {
        const idUser = req.params.idUser;
        await UsersModel.updateOne(
            {
                _id: idUser
            },
            {
                $set: {
                    role: req.body.role,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    note: req.body.note
                }
            }
        );
        const updatedUser = await UsersModel.findById(idUser);

        res.status(200).json({ updatedUser, success: true });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
});

router.patch('/update-password/:idUser', async (req, res) => {
    const idUser = req.params.idUser;
    try {
        const user = await UsersController.updatePassword(idUser, req.body.password);
        res.json({user, success: true});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;


// {
//     "value": {
//         "firstName": "A",
//         "lastName": "Nguyen Van",
//         "email": "nguyenvana@gmail.com",
//         "password": "nguyenvana"
//     },
//     "error": {
//         "_original": {
//              "firstName": "A",
//              "lastName": "Nguyen Van",
//              "email": "nguyenvana@gmail.com",
//              "password": "nguyenvana"
//         },
//         "details": [
//             {
//                 "message": "\"firstName\" length must be at least 6 characters long",
//                 "path": [
//                     "firstName"
//                 ],
//                 "type": "string.min",
//                 "context": {
//                     "limit": 6,
//                     "value": "A",
//                     "label": "firstName",
//                     "key": "firstName"
//                 }
//             }
//         ]
//     }
// }