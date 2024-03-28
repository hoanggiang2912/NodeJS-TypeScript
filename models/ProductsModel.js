const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductsSchema = new mongoose.Schema({
    idCategory: {
        type: ObjectId,
        ref: 'categories'
    },
    title: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    qty: { 
        type: Number, 
        required: true 
    },
    salePrice: Number,
    background: {
        'lazy-load': String,
        main: String,
        sub: String
    },
    thumbnails: Array,
    description: Array,
    viewed: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('products', ProductsSchema);