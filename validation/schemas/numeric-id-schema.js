const joi = require("joi");

const numericIdSchema = joi.number().integer().positive().required();

module.exports = numericIdSchema;
