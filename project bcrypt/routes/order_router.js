const express = require('express')

const orderController = require('../controllers/order_controller')

const verfiyToken = require('../middlewares/verifiyToken')

const route = express.Router()

route.post('/:token', verfiyToken, orderController.create)
route.put('/:token' , verfiyToken , orderController.update)
module.exports = route