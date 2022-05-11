const nodemailer = require("nodemailer");

const sendMail = async (req, res, next) => {

    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user: process.env.email, // generated ethereal user
            pass: process.env.password, // generated ethereal password
        }
    });

    let info = await transporter.sendMail({
        from: process.env.email, // sender address
        to: req.user.email, // list of receivers
        subject: req.mail.subject, // Subject line
        text: req.mail.text, // plain text body
        html: req.mail.html, // html body
    })
    .catch(console.error);

}

module.exports = sendMail