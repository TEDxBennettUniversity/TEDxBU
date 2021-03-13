const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

const detailSchema = Joi.object({
    details: Joi.object({
        name: Joi.string().required().escapeHTML(),
        email: Joi.string().email({ tlds: { allow: false } }).required().escapeHTML(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().escapeHTML(),
        institution: Joi.string().required().escapeHTML(),
        awareness: Joi.string().required().escapeHTML(),
    }).required()
});

const subscriptionSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().escapeHTML()
});

const contactSchema = Joi.object({
    contact: Joi.object({
        name: Joi.string().required().escapeHTML(),
        email: Joi.string().email({ tlds: { allow: false } }).required().escapeHTML(),
        subject: Joi.string().required().escapeHTML(),
        number: Joi.string().pattern(/^[0-9]+$/).required().escapeHTML(),
        message: Joi.string().required().escapeHTML()
    }).required()
})

module.exports = { detailSchema, subscriptionSchema, contactSchema };