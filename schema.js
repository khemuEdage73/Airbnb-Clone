const Joi = require("joi");

const listingSchema = Joi.object({
    title:Joi.string().required(),
    description: Joi.string(),
    image: Joi.string().uri(),
    price: Joi.number(),
    location: Joi.string(),
    country: Joi.string
});

module.exports = listingSchema;