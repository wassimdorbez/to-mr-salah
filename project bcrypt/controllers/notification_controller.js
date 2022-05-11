const Notification = require('../models/Notification')

module.exports = {

    create: (req, res) => {
        let data = {
            text: ' .notification.text',
            subject: '.notification.subject',
            from: req.user.id,
            to: req.body.to
        }


        const notification = new Notification(data)

        notification.save((err, notif) => {
            notif
                .populate('to from')
                .then(data => {
                    res.status(200).json({
                        messagee: "notification",
                        success: true,
                        data: data
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        messagee: "error",
                        success: false,
                        errors: 'fs'+err
                    })
                })
        })
        /* .then(notif => {
            notification
                .populate('to')
                .populate('from')
                .execPopulate()
                .then(data => {
                    res.status(200).json({
                        messagee: "notification",
                        success: true,
                        data: data
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        messagee: "error",
                        success: false,
                        errors: err
                    })
                })
        }) */

    }

}