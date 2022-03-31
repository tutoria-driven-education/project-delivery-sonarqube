function schemaValidation(schema) {
  return function (value) {
    const { error } = schema.validate(value);
    if (error) {
      return error.details[0].message;
    }
    return true;
  };
}

module.exports = schemaValidation;
