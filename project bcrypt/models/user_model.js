const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    avatar: {
        type: String,
        default : 'user.png'
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    zip_code: {
        type: Number
    },
    role: {
        type: String,
        enum: ['admin', 'client', 'livreur'],
        default : 'client'
    },
    isactive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

module.exports = new mongoose.model('user', userSchema)