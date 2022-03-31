const joi = require("joi");

const zipUrlSchema = joi
  .string()
  .pattern(/\.zip$/)
  .uri()
  .required();

module.exports = zipUrlSchema;
