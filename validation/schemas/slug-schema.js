const joi = require("joi");

const slugSchema = joi
  .string()
  .regex(/[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .required();

module.exports = slugSchema;
