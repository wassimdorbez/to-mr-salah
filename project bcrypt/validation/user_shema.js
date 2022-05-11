const joi = require('@hapi/joi')

const CreateUserValidation = data => {
    const schema = joi.object({
        username: joi
            .string()
            .min(3)
            .max(20)
            .required()
        ,
        email: joi
            .string()
            .required()
            .email()
        ,
        password: joi
            .string()
            .min(6)
            .alphanum()
            .required()
        ,
        phone: joi
            .string().length(8).pattern(/^[0-9]+$/).required()
        ,
        address: joi
            .string()
            .required()
        ,
        zip_code: joi
            .number()
        ,
        role: joi
            .string()
            .valid('admin', 'client', 'livreur')
    })

    return schema.validate(data, { abortEarly: false })
}

const ValidateLoginData = data => {
    const schema = joi.object({
        email: joi
            .string()
            .email()
            .required()
        ,
        password: joi
            .string()
            .min(6)
            .alphanum()
            .required()
    })

    return schema.validate(data, { abortEarly: false })

}

const ValidateResetPasswordData = data => {
    const schema = joi.object({
        password: joi
            .string()
            .min(6)
            .alphanum()
            .required()
        ,
        confirm: joi
            .string()
            .min(6)
            .alphanum()
            .required()
    })

    return schema.validate(data, { abortEarly: false })

}

module.exports = {
    CreateUserValidation,
    ValidateLoginData,
    ValidateResetPasswordData
}