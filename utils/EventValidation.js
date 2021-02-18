const Joi = require('joi');

module.exports.validEventCreated = (eventName, description, date) => {
    let errors;
    const eventSchema = Joi.object().keys({
        eventName: Joi.string().min(3).required(),
        description: Joi.string().min(10).required(),
        date: Joi.string().isoDate().required(),
    });

    const { value, error } = eventSchema.validate({ eventName, description, date }, { abortEarly: false })
    if (error) {
        errors = error.details.map(e => e.message)
        return errors
    }
    else {
        errors = null;
        return errors
    }
}

module.exports.validInviteInput = (email) => {
    let errors;
    const eventSchema = Joi.object().keys({
        email: Joi.string().email().lowercase().required(),
    });

    const { value, error } = eventSchema.validate({ email }, { abortEarly: false })
    if (error) {
        errors = error.details.map(e => e.message)
        return errors
    }
    else {
        errors = null;
        return errors
    }
}