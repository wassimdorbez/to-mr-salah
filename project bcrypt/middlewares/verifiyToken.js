const jwt = require('jsonwebtoken')

const verfiyToken = (req, res, next) => {

    
    const token = req.params.token ? req.params.token : req.cookies.access_token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            message: 'NOT AuTHORIZED'
        })
    }

}

module.exports = verfiyToken