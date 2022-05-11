const express = require('express')

const productController = require('../controllers/product_controller')

const upload = require('../middlewares/upload')

const route = express.Router()

route.post('/addimage/:id', upload.array('images'), productController.addProductImage)
route.delete('/imagebyImageId', productController.deleteProductImageById)
route.post('/', upload.array('images'), productController.create)
route.delete('/:id', productController.deleteProduct)
route.delete('/', productController.deleteAll)
route.get('/', productController.getProducts)

module.exports = route