// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const Joi = require('joi');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, method } = context;

    let schema;

    if (method === 'create' || method === 'update') {
      // Create / Update - Full schema validation
      schema = Joi.object({
        title: Joi.string().required(),
        done: Joi.boolean().default(false)
      }).options({ stripUnknown: true });
    } else if (method === 'patch') {
      // Patch - Need to specify at least one of the fields
      schema = Joi.object({
        title: Joi.string(),
        done: Joi.boolean()
      })
        .or('title', 'done').required()
        .options({ stripUnknown: true });
    }

    const validatedData = await schema.validateAsync({ ...data });
    context.data = validatedData;

    return context;
  };
};
