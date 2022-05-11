const express = require('express')

const categoryController = require('../controllers/category_controller')

const route = express.Router()

route.post('/', categoryController.create)
route.delete('/:id', categoryController.deleteCategory)
route.put('/:id', categoryController.update)
route.get('/', categoryController.getAll)

module.exports = route