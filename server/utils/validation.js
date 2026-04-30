const Joi = require("joi")

const schema = Joi.object({
   username: Joi.string().required(),
   email: Joi.string().email().required(),
   dateOfBirth: Joi.date().required(),
})

module.exports = { schema }
