const Joi = require('joi');

const detailSchema = Joi.object({
    details: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
    }).required()
});

module.exports = { detailSchema };