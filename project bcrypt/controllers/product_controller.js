const mongoose = require('mongoose')
const Product = require('../models/product_model')
const { createProductValidation } = require('../validation/product_schema')

module.exports = {
    create: (req, res) => {

        const images = []

        for (let i = 0; i < req.files.length; i++) {
            images.push({
                name: req.files[i].filename
            })
        }

        let data = {
            name: req.body.name,
            description: req.body.description,
            images: images,
            price: req.body.price,
            category: req.body.category,
            qte: req.body.qte
        }

        // test de validation
        const { error } = createProductValidation(data)

        if (error)
            return res.status(422).json({
                success: false,
                message: 'product data invalid',
                errors: error
            })


        // création
        Product.create(data, (err, product) => {
            if (err) {
                res.status(500).json({
                    message: 'error adding new product',
                    success: false,
                    errors: err
                })
            } else {
                res.status(201).json({
                    message: 'product successfuly added',
                    success: true,
                    data: product
                })
            }
        })

    },


    deleteProduct: (req, res) => {
        Product.findByIdAndDelete({ _id: req.params.id }, (err, product) => {
            if (err) {
                res.status(500).json({
                    message: 'error  deleting product',
                    success: false,
                    errors: err
                })
            } else {
                res.status(200).json({
                    message: 'product successfuly deleted',
                    success: true,
                    data: product
                })
            }
        })
    }

    ,

    deleteAll: (req, res) => {
        Product.deleteMany({}, (err, prods) => {
            if (err) {
                res.status(500).json({
                    message: 'error delting products',
                    success: false,
                    errors: err
                })
            } else {
                res.status(200).json({
                    message: 'successful delting products',
                    success: true
                })
            }
        })
    }

    ,

    deleteProductImageById: async (req, res) => {

        const product = await Product.findOne({ _id: req.body.productid })

        //  const newproduct = new Product(product)

        let images = product.images

        let dt = images.filter(img => img._id.toHexString() !== req.body.imageid)

        product.images = dt

        product.save()
            .then(prod => {
                res.status(200).json({
                    message: "product image successfuly deleted",
                    success: true,
                    data: prod
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: "product image not deleted",
                    success: false,
                    errors: err
                })
            })

    }
    ,

    addProductImage: async (req, res) => {

        let imgs = []


        for (let item of req.files) {

            imgs.push({ name: item.filename })
        }


        const product = await Product.findOne({ _id: req.params.id })
        let images = [...product.images, ...imgs]
        console.log(images);
        product.images = images

        product.save()
            .then(prod => {
                res.json(prod)
            })
            .catch(err => {
                res.json(err)
            })
    }
    ,
    getProducts: (req, res) => {
        Product.find({})
            .populate('category ', 'name icon')
            .then(products => {
                res.status(200).json({
                    message: 'products',
                    success: true,
                    data: products
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: 'error',
                    success: false,
                    errors: err
                })
            })
    },
    
}