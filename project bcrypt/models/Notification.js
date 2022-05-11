const mongoose = require("mongoose")

const notififcationSchema = new mongoose.Schema({
    text: String,
    subject: String,
    read: {
        type: Boolean,
        default: false
    },
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    to: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

module.exports = new mongoose.model('notification', notififcationSchema)