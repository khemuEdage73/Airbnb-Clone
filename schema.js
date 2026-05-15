const Joi = require("joi");

const listingSchema = Joi.object({
    title:Joi.string().required(),
    description: Joi.string(),
    image: Joi.string().uri(),
    price: Joi.number(),
    location: Joi.string(),
    country: Joi.string,
    category: Joi.string,
    facilities: Joi.string,
});

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().allow("").required(),
        rating: Joi.number().min(1).max(5).required()
    }).required(),
})

module.exports = {listingSchema, reviewSchema};