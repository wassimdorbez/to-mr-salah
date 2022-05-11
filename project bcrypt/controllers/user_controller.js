const User = require('../models/user_model')
const { CreateUserValidation, ValidateLoginData, ValidateResetPasswordData } = require('../validation/user_shema')
const bcrypt = require('bcrypt');
const { SignToken, signTokenWithoutExpiration } = require('../helpers/authenttication');

module.exports = {
    // create user operation
    register: async (req, res, next) => {
        //  ajouter un nouveau utilisateur a ala base de donnée

        const { error } = CreateUserValidation(req.body)

        if (error)
            return res.status(422).json({
                success: false,
                errors: error,
                message: 'user data validation error'
            })

        const { password, email } = req.body

        // tester l'existance de user avec email
        const user = await User.findOne({ email: email })

        if (user)
            return res.status(422).json({
                messaage: 'user invalid credantials',
                errors: {
                    details: [
                        {
                            "message": "user with this email is already exist!",
                            "path": [
                                "email"
                            ]
                        }
                    ]
                }
            })


        // cryptage 
        const passwordhash = await bcrypt.hash(password, 10)

        req.body.password = passwordhash

        User.create(req.body, async (err, user) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    errors: err,
                    message: 'error creating new user',
                    data: null
                })
            } else {
                res.status(201).json({
                    success: true,
                    message: 'success creating new user',
                    data: user
                })

                const token = await signTokenWithoutExpiration(user._id)

                req.user = user
                req.mail = {
                    subject: 'acount verification',
                    text: 'click the link below to verify your acount',
                    html: `<a href=http:activate//localhost:3000//${token} >click here to activate your acount</a>`,
                }
                next()
            }
        })


    },

    login: async (req, res) => {

        const { password, email } = req.body

        const { error } = ValidateLoginData(req.body)

        if (error)
            return res.status(422).json({
                success: false,
                errors: error,
                message: 'user data validation error'
            })


        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(422).json({
                success: false,
                errors: {
                    details: [
                        {
                            path: ['email'], message: 'user with this email does not exist'
                        }
                    ]
                },
            })
        }

        const ismatch = await bcrypt.compare(password, user.password)
        console.log(ismatch);
        if (!ismatch) {
            res.status(422).json({
                success: false,
                errors: {
                    details: [
                        {
                            path: ['password'], message: 'invalid password try again'
                        }
                    ]
                },
            })
        } else {

            if (user.isactive) {
                // retur res.cookie response to the broowser
                const token = await SignToken(user._id, user.role);

                res.cookie("access_token", token, { maxAge: 3600 * 1000, httpOnly: true, sameSite: true });

                delete user._id
                delete user.password

                res.status(200).json({
                    success: true,
                    role: user.role,
                    user: user,
                    message: 'succesffully logged in',
                })

            } else {
                res.status(422).json({
                    success: false,
                    errors: {
                        details: [
                            {
                                path: ['isactive'], message: 'your acount is not activated check your mail box'
                            }
                        ]
                    },
                })
            }

        }

    },

    // delete user operation 
    deleteUser: (req, res) => {
        User.findByIdAndDelete({ _id: req.params.id }, (err, user) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    errors: err,
                    message: 'user not deleted',
                    data: null
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'user successfuly deleted',
                    data: user
                })
            }
        })
    },

    update: (req, res) => {
        User.findByIdAndUpdate({ _id: req.user.id }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'error updating user',
                    errors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'user successfuly updated',
                    data: user
                })
            }
        })
    }
    ,

    getById: (req, res) => {
        User.findById({ _id: req.params.id }, (err, user) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'user not found',
                    errors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'user  found',
                    data: user
                })
            }
        })
    },

    getall: (req, res) => {
        User.find({}, (err, users) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'no users in system',
                    errors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'users in system',
                    data: users
                })
            }
        })
    },

    getUsersBydate: (req, res) => {

        User.find({ createdAt: { $gte: req.body.date } }, (err, users) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'no users in system',
                    errors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'users in system',
                    data: users
                })
            }
        })
    },

    getUsersByName: (req, res) => {
        User.find({ username: { $regex: req.body.keyword } }, (err, users) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'no users in system',
                    errors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'users in system :' + users.length,
                    data: users
                })
            }
        })
    },

    uploadavatar: (req, res) => {
        User.findByIdAndUpdate(
            { _id: req.user.id },
            { avatar: req.file.filename },
            { new: true }, (err, user) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'error saving image',
                        errors: err
                    })
                } else {
                    
                    const u  = {
                        username : user.username,
                        email : user.email,
                        avatar : user.avatar,
                        phone : user.phone,
                        address : user.address,
                        zip_code : user.zip_code,
                    }
                    
                    res.status(200).json({
                        success: true,
                        message: 'image saved',
                        data: u
                    })
                }

            })
    },

    activateAcount: (req, res) => {
        User.findByIdAndUpdate({ _id: req.user.id }, { isactive: true }, (err, user) => {
            res.json({
                success: true,
            })
        })
    },

    forgetPassword: async (req, res, next) => {

        const { email } = req.body

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(422).json({
                messaage: 'invalid email',
                success: false,
                errors: {
                    details: [
                        {
                            message: "user with this email is not exist",
                            path: [
                                "email"
                            ]
                        }
                    ]
                }
            })
        }
        const token = signTokenWithoutExpiration(user._id)

        req.user = user
        req.mail = {
            subject: 'Reset Password',
            text: 'Click the link below to reset your password',
            html: `<a href='http://localhost:3000/reset/${token}'  >reset password link</a>`
        }
        res.status(200).json({
            success: true,
            message: 'check your mail box to reset password'
        })
        next()


    },


    resetpassword: async (req, res) => {

        const { password, confirm } = req.body

        const { error } = ValidateResetPasswordData(req.body)

        if (error) {
            return res.status(422).json({
                message: 'validation error',
                errors: error,
                success: false
            })
        }

        if (password !== confirm) {
            return res.status(422).json({
                message: 'validation error',
                errors: {
                    details: [
                        {
                            path: ['confirm'], message: 'password does not match'
                        }
                    ]
                },
                success: false
            })
        }

        const passwordhash = await bcrypt.hash(password, 10)

        User.findByIdAndUpdate({ _id: req.user.id }, { password: passwordhash }, (err, user) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'error updating password',
                    errors: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'password successffuly updated',
                })
            }
        })

    },

    isAuthenticated: async (req, res) => {

        const user = await User.findOne({ _id: req.user.id })

  

            res.status(200).json({
                success: true,
                role: req.user.role,
                user: user
            })
   

    },

    logout: (req, res) => {
        res.clearCookie("access_token");
        res.status(200).json({
            isconnected: false,
            role: 'visitor'
        })
    }


}