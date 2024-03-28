const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: "",
        max: 50
    },
    lastName: {
        type: String,
        default: "",
        max: 50
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 32
    },
    phone: {
        type: String,
        required: true,
        default: ""
    },
    role: {
        type: String,
        default: "user"
    },
    addresses: {
        type: Array,
        default: []
    },
    note: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "active"
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users', userSchema);