const jwt = require('jsonwebtoken')

const SignToken = (uid, role) => {
    return jwt.sign({
        id: uid,
        role: role
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const signTokenWithoutExpiration = (uid) => {
    return jwt.sign({
        id: uid
    }, process.env.JWT_SECRET);
}

module.exports = {
    SignToken,
    signTokenWithoutExpiration
}