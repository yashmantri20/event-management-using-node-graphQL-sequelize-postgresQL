const Joi = require('joi');

module.exports.validRegiterInput = (username, email, password) => {
    let errors;
    const userSchema = Joi.object().keys({
        username: Joi.string().required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).required().strict()
    });

    const { value, error } = userSchema.validate({ username, password, email }, { abortEarly: false })
    if (error) {
        errors = error.details.map(e => e.message)
        return errors
    }
    else {
        errors = null;
        return errors
    }
}

module.exports.validLoginInput = (email, password) => {
    let errors;
    const userSchema = Joi.object().keys({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required().strict()
    });

    const { value, error } = userSchema.validate({ password, email }, { abortEarly: false })
    if (error) {
        errors = error.details.map(e => e.message)
        return errors
    }
    else {
        errors = null;
        return errors
    }
}

module.exports.validChangePasswordInput = (oldPassword, newPassword) => {
    let errors;
    const userSchema = Joi.object().keys({
        oldPassword: Joi.string().required().strict(),
        newPassword: Joi.string().min(6).required().strict()
    });

    const { value, error } = userSchema.validate({ oldPassword, newPassword }, { abortEarly: false })
    if (error) {
        errors = error.details.map(e => e.message)
        return errors
    }
    else {
        errors = null;
        return errors
    }
}

module.exports.validResetPasswordInput = (email) => {
    let errors;
    const userSchema = Joi.object().keys({
        email: Joi.string().email().lowercase().required(),
    });

    const { value, error } = userSchema.validate({ email }, { abortEarly: false })
    if (error) {
        errors = error.details.map(e => e.message)
        return errors
    }
    else {
        errors = null;
        return errors
    }
}


module.exports.validChangePasswordInput = (newPassword) => {
    let errors;
    const userSchema = Joi.object().keys({
        newPassword: Joi.string().min(6).required().strict()
    });

    const { value, error } = userSchema.validate({ newPassword }, { abortEarly: false })
    if (error) {
        errors = error.details.map(e => e.message)
        return errors
    }
    else {
        errors = null;
        return errors
    }
}


