const yup = require('yup');

const { testUserName, testEmptyObject } = require('./testsYup');

const filterUserSchema = yup.object().shape({
  page: yup
    .number()
    .positive(),

  pageSize: yup
    .number()
    .positive(),

  id: yup
    .string()
    .strict()
    .uuid(),

  isActive: yup
    .boolean(),

  deletedAt: yup
    .date(),

  createdAt: yup
    .date(),

  isRejected: yup
    .boolean(),

});

const listExchangeSchema = yup.object().shape({
  page: yup.number().positive().required(),
  limit: yup.number().positive().required(),
});

const validateUuidSchema = yup.object().shape({
  id: yup
    .string()
    .strict()
    .uuid()
    .required(),
});

const validateEmailSchema = yup.object().shape({
  email: yup
    .string()
    .strict()
    .email()
    .required(),
});

const validateUserNameSchema = yup.object().shape({
  userName: yup
    .string()
    .strict()
    .min(3)
    .max(30)
    .required()
    .test('equal', 'Username must contain only lowercase letters and numbers', async (userName) => testUserName(userName)),
});

const validateEmptyObject = yup.object().test(
  'equal',
  'You must inform at least one field to update',
  async (object) => testEmptyObject(object),
);

module.exports = {
  filterUserSchema,
  listExchangeSchema,
  validateUuidSchema,
  validateEmailSchema,
  validateUserNameSchema,
  validateEmptyObject,
};
