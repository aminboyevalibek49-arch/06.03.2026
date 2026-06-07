const joi = require("joi");

module.exports = function (data) {
  const schema = joi.object({
    full_name: joi.string().required(),
    birth_year: joi.number().integer().required(),
    death_year: joi.string().required(),
    bio: joi.string().required(),
    period: joi.string().required(),
    work: joi.string().required(),
    region: joi.string().required(),
  });

  return schema.validate(data);
};
