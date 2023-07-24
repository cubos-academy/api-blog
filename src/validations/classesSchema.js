const yup = require('yup');

const startClassSchema = yup.object().shape({
  studentUserId: yup
    .string()
    .strict()
    .uuid()
    .required(),

});

module.exports = {
  startClassSchema,
};
