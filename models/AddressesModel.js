const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    idUser: {
        type: ObjectId,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    addressDetail: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('addresses', addressSchema);