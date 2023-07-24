const yup = require('yup');

const {
  testClassTime, validateUsertype, testUpdateClassTime,
} = require('./testsYup');

const createTeacherSchema = yup.object().shape({
  cnpj: yup
    .string()
    .strict(),

  category: yup
    .string()
    .strict(),

  languages: yup
    .string()
    .strict()
    .required(),

  availability: yup
    .string()
    .strict()
    .required()
    .test('equal', 'Horario selecionado invalido', (availability) => testClassTime(availability)),

  planId: yup
    .string()
    .strict()
    .uuid()
    .required(),
});

const updateTeacherSchema = yup.object().shape({
  cnpj: yup
    .string()
    .strict(),

  languages: yup
    .string()
    .strict(),

  category: yup
    .string()
    .strict(),

  additionalInfo: yup
    .string()
    .strict(),

  availability: yup
    .string()
    .strict()
    .test('equal', 'Horario selecionado invalido', (availability) => testUpdateClassTime(availability)),

  planId: yup
    .string()
    .strict()
    .uuid(),
});

const verifyIsTeacher = yup.object().shape({
  userType: yup
    .string()
    .strict()
    .required()
    .test('equal', 'User does not have permissions to proceed with this action', async (userType) => validateUsertype(['Teacher'], userType)),
});

const verifyIsTeacherOrAdmin = yup.object().shape({
  userType: yup
    .string()
    .strict()
    .required()
    .test('equal', 'User does not have permissions to proceed with this action', async (userType) => validateUsertype(['Teacher', 'Super Admin', 'Admin'], userType)),
});

module.exports = {
  createTeacherSchema,
  updateTeacherSchema,
  verifyIsTeacher,
  verifyIsTeacherOrAdmin,
};
