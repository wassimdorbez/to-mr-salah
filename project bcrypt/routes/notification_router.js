const express = require('express')

const notification_Controller = require('../controllers/notification_controller')

const verfiyToken = require('../middlewares/verifiyToken')

const route = express.Router()

route.post('/:token', verfiyToken, notification_Controller.create)

module.exports = route