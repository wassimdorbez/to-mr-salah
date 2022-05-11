const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    images: [{
        name: {
            type : String
        } 
    }],
    price: Number,
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category'

    },
    qte: Number,
    selled: {
        type: Number,
        default: 0
    }
})

module.exports = new mongoose.model('product', productSchema)