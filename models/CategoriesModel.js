const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    banner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    products: [{
        type: ObjectId,
        ref: 'products',
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('categories', CategoriesSchema);