const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    icon: String,
    name: String
}, { timestamps: true })

module.exports = new mongoose.model('category', categorySchema)