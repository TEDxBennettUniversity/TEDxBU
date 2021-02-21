const ExpressError = require('./ExpressError');
const { detailSchema, subscriptionSchema, contactSchema } = require('./schemas');

const validate = (req, res, next, schema) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateDetails = (req, res, next) => {
    validate(req, res, next, detailSchema);
};

const validateSubscription = (req, res, next) => {
    validate(req, res, next, subscriptionSchema);
};

const validateContact = (req, res, next) => {
    validate(req, res, next, contactSchema);
};

module.exports = { validateDetails, validateSubscription, validateContact };