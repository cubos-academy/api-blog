const yup = require('yup');

const {
  validateUsertype,
  testUpdateClassTime,
  testCredits,
  testUpdateUserName,
  testUpdateFullName,
  testUpdateSpaceInString,
  testBirthdate,
} = require('./testsYup');

const verifyIsAdmin = yup.object().shape({
  userType: yup
    .string()
    .strict()
    .required()
    .test('equal', 'User does not have permissions to proceed with this action', async (userType) => validateUsertype(['Super Admin', 'Admin'], userType)),
});

const verifyIsSuperAdmin = yup.object().shape({
  userType: yup
    .string()
    .strict()
    .required()
    .test('equal', 'User does not have permissions to proceed with this action', async (userType) => validateUsertype(['Super Admin'], userType)),
});

const matchMakingSchema = yup.object().shape({
  studentId: yup
    .string()
    .strict()
    .uuid()
    .required(),

  teacherId: yup
    .string()
    .strict()
    .uuid()
    .required(),
});

const addCreditsSchema = yup.object().shape({
  credits: yup
    .number()
    .strict()
    .positive()
    .required()
    .test('Test credits', 'Invalid amount of credits', (credit) => testCredits(credit)),
});

const withdrawCreditsSchema = yup.object().shape({
  credits: yup
    .number()
    .strict()
    .positive()
    .required(),
});

const acceptStudentSchema = yup.object().shape({

  credits: yup
    .number()
    .strict()
    .positive()
    .test('Test credits', 'invalid amount of credits', (credit) => testCredits(credit)),

  teacherId: yup
    .string()
    .strict()
    .uuid(),

  fullName: yup
    .string()
    .strict()
    .min(3)
    .test('test letters', 'Name must contain only letters ', (fullName) => testUpdateFullName(fullName))
    .test('test space', 'You must add your first and last name', async (fullName) => testUpdateSpaceInString(fullName)),

  email: yup
    .string()
    .strict()
    .email(),

  birthdate: yup
    .date()
    .test('valid date', 'Minimum age for registration is 5 years', (birthdate) => testBirthdate(birthdate)),

  phone: yup
    .string()
    .strict(),

  userName: yup
    .string()
    .strict()
    .min(3)
    .max(30)
    .test('test letters', 'Username must contain only lowercase letters and numbers', async (userName) => testUpdateUserName(userName)),

  cpf: yup
    .string()
    .strict(),

  planId: yup
    .string()
    .strict()
    .uuid(),

  additionalServiceId: yup
    .string()
    .strict()
    .uuid(),

  classesTime: yup
    .string()
    .strict()
    .test('equal', 'Invalid class time selected', (classesTime) => testUpdateClassTime(classesTime)),

  classesPerMonth: yup
    .number()
    .strict()
    .positive(),

});

const acceptTeacherSchema = yup.object().shape({
  fullName: yup
    .string()
    .strict()
    .min(3)
    .test('test letters', 'Name must contain only letters ', (fullName) => testUpdateFullName(fullName))
    .test('test space', 'You must add your first and last name', async (fullName) => testUpdateSpaceInString(fullName)),

  userName: yup
    .string()
    .strict()
    .min(3)
    .max(30)
    .test('test letters', 'Username must contain only lowercase letters and numbers', async (userName) => testUpdateUserName(userName)),

  email: yup
    .string()
    .strict()
    .email(),

  phone: yup
    .string()
    .strict(),

  cnpj: yup
    .string()
    .strict(),

  category: yup
    .string()
    .strict(),

  availability: yup
    .string()
    .strict()
    .test('equal', 'Invalid time selected', (availability) => testUpdateClassTime(availability)),

  planId: yup
    .string()
    .strict()
    .uuid(),
});

module.exports = {
  matchMakingSchema,
  verifyIsAdmin,
  verifyIsSuperAdmin,
  addCreditsSchema,
  withdrawCreditsSchema,
  acceptStudentSchema,
  acceptTeacherSchema,
};
