const yup = require('yup');

const { testClassTime, validateUsertype, testUpdateClassTime } = require('./testsYup');

const createStudentSchema = yup.object().shape({
  cpf: yup
    .string()
    .strict(),

  classesPerMonth: yup
    .number()
    .strict()
    .positive()
    .required(),

  classesTime: yup
    .string()
    .strict()
    .required()
    .test('equal', 'Horario selecionado invalido', (classesTime) => testClassTime(classesTime)),

  planId: yup
    .string()
    .strict()
    .uuid()
    .required(),
});

const updateStudentSchema = yup.object().shape({
  cpf: yup
    .string()
    .strict(),

  additionalInfo: yup
    .string()
    .strict(),

  classesPerMonth: yup
    .number()
    .strict()
    .positive(),

  classesTime: yup
    .string()
    .strict()
    .test('equal', 'Horario selecionado invalido', (classesTime) => testUpdateClassTime(classesTime)),

  planId: yup
    .string()
    .strict()
    .uuid(),

  additionalServiceId: yup
    .string()
    .strict()
    .uuid(),

  teacherId: yup
    .string()
    .strict()
    .uuid(),
});

const verifyIsStudent = yup.object().shape({
  userType: yup
    .string()
    .strict()
    .required()
    .test('equal', 'User does not have permissions to proceed with this action', async (userType) => validateUsertype(['Student'], userType)),
});

module.exports = {
  verifyIsStudent,
  createStudentSchema,
  updateStudentSchema,
};
