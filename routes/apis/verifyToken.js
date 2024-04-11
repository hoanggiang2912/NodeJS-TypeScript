const jwt = require('jsonwebtoken');

const verify = function (req, res, next) {
    // try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            console.log('Token:', token);
            const verify = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verify;
            next();
        } else {
            console.log('Token not found');
        }
        // next();
    // } catch (error) {
    //     res.status(400).send('Invalid Token');
    // }
}

module.exports.verify = verify;