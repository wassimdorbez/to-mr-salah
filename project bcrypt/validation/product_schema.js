const joi = require('@hapi/joi')

const createProductValidation = data => {

    const schema = joi.object({
        name : joi
        .string()
        .required()
        ,
        description : joi
        .string()
        .required()
        ,
        images : joi
        .array()
        .min(1)
        .required()
        ,
        price : joi
        .number()
        .required()
        ,
        category : joi
        .string()
        .required()
        ,
        qte : joi
        .number()
        .required()
        
    })
    return schema.validate(data, { abortEarly: false })
}

module.exports = {
    createProductValidation
}