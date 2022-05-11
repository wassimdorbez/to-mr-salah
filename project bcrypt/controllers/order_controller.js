const Order = require('../models/order_model')

module.exports = {
    create: (req, res) => {

        const data = {
            client: req.user.id,
            products: req.body.products,
            prix_total: req.body.prix_total,
        }

        Order.create(data, (err, order) => {
            if (err) {
                res.status(500).json({
                    message: 'error adding order',
                    success: false,
                    errors: err
                })
            } else {
                res.status(201).json({
                    message: 'success adding order',
                    success: true,
                    data: order
                })
            }
        })

    },

    update: (req, res) => {

        const data = {
            status: {
                code: req.body.code,
                user: req.user.id
            }
        }

        Order.findByIdAndUpdate({ _id: req.body.id }, data, { new: true })
            .populate('client')
            .populate('status.user')
            .populate('products.product')
            .then(order => {
                res.status(200).json({
                    message: "updated",
                    success: true,
                    data: order
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: "error update",
                    success: false,
                    errors: err
                })
            })
    },

    deleteOrder: (req, res) => {
        Order.findByIdAndDelete({ _id: req.params.id })
            .then(order => {
                res.status(200).json({
                    message: "deleted",
                    success: true,
                    data: order
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: "error ",
                    success: false,
                    errors: err
                })
            })
    }

    ,

    getOrders: (req, res) => {

        Order.find({})
            .populate('client')
            .populate('status.user')
            .populate('products.product')
            .then(orders => {

                switch (req.user.role) {
                    case "admin":
                        res.status(200).json({
                            message: 'orders',
                            success: true,
                            data: orders
                        });
                        break;
                    case "client":
                        res.status(200).json({
                            message: 'orders',
                            success: true,
                            data: orders.filter(o => o.client === req.user.id)
                        });
                        break;
                    case "livreur":
                        res.status(200).json({
                            message: 'orders',
                            success: true,
                            data: orders.filter(o => o.livreur === req.user.id)
                        });
                        break;
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "no oroders ",
                    success: false,
                    errors: err
                })
            })
    }

}