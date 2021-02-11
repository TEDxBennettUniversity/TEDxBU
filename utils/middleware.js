const ExpressError = require('./ExpressError');
const { detailSchema } = require('./schemas');

const validateDetails = (req, res, next) => {
    const { error } = detailSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports = { validateDetails };