const express = require('express')
require('dotenv').config()
require('./config/database')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

// to read body from request
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

//routes
app.use('/users', require('./routes/user_router'))
app.use('/categories', require('./routes/category_router'))
app.use('/products', require('./routes/product_router'))
app.use('/orders', require('./routes/order_router'))
app.use('/notifications', require('./routes/notification_router'))

// to get images from stoarage
app.get("/getimage/:imagename", function (req, res) {
    res.sendFile(__dirname + "/uploads/" + req.params.imagename);
});

app.listen(5000, () => {
    console.log('server is runing on port 5000');
})