const express = require('express')

const userController = require('../controllers/user_controller')
const route = express.Router()

const upload = require('../middlewares/upload')
const verifyToken = require('../middlewares/verifiyToken')
const sendMail = require('../middlewares/sendMail')

route.put('/uploadavatar', upload.single('avatar'), verifyToken, userController.uploadavatar)
route.post('/', userController.register, sendMail)
route.post('/login', userController.login)
route.delete('/:id', userController.deleteUser)
route.put('/', verifyToken, userController.update)
route.get('/:id', userController.getById)
route.post('/getbydate', userController.getUsersBydate)
route.post('/getbyname', userController.getUsersByName)
route.get('/', userController.getall)
route.get('/activate/:token', verifyToken, userController.activateAcount)
route.post('/forgetpassword', userController.forgetPassword, sendMail)
route.post('/resetpassword/:token', verifyToken, userController.resetpassword)
route.post('/isauthenticated', verifyToken, userController.isAuthenticated)
route.post('/logout', verifyToken, userController.logout)

module.exports = route