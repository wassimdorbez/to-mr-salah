const Category = require('../models/category_model')

module.exports = {
    create: (req, res) => {

        const { icon, name } = req.body

        if (!icon || !name)
            return res.status(422).json({
                success: false,
                message: 'please enter all fields'
            })

        Category.create(req.body, (err, cat) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    messge: "error creating new category",
                    erors: err
                })
            } else {
                res.status(201).json({
                    success: true,
                    message: 'category successfily added',
                    data: cat
                })
            }
        })
    },

    update: (req, res) => {
        Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, cat) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    messge: "error updating category",
                    erors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    messge: "category updated successfuly",
                    data: cat
                })
            }
        })
    },

    deleteCategory: (req, res) => {
        Category.findByIdAndDelete({ _id: req.params.id }, (err, cat) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    messge: "error deleting category",
                    erors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    messge: "category deleted successfuly",
                    data: cat
                })
            }
        })
    },

    getAll: (req, res) => {
        Category.find({}, (err, cats) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    messge: "error getting categories ",
                    erors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    messge: "categories in system",
                    data: cats
                })
            }
        })
    }
}