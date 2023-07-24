const yup = require('yup');

const {
  testBirthdate,
  testUserName,
  testFullName,
  testPassword,
  testSpaceInString,
  testUpdateUserName,
  testUpdateFullName,
  testUpdatePassword,
  testUpdateSpaceInString,
} = require('./testsYup');

const createUserSchema = yup.object().shape({
  phone: yup
    .string()
    .strict(),

  birthdate: yup
    .date()
    .required()
    .test('valid date', 'Minimum age for registration is 5 years', (birthdate) => testBirthdate(birthdate)),

  email: yup
    .string()
    .strict()
    .email()
    .required(),

  comparePassword: yup
    .string()
    .strict()
    .required()
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),

  acceptedTerms: yup
    .bool()
    .strict()
    .required()
    .test('verify terms', 'You must accept the terms and conditions', async (condition) => condition),

  password: yup
    .string()
    .strict()
    .required()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .test('equal', 'Password must contain letters, numbers and special characters', (password) => testPassword(password)),

  userName: yup
    .string()
    .strict()
    .min(3)
    .max(30)
    .required()
    .test('equal', 'Username must contain only lowercase letters and numbers', async (userName) => testUserName(userName)),

  fullName: yup
    .string()
    .strict()
    .min(3)
    .required()
    .test('verify number', 'Name must contain only letters ', (fullName) => testFullName(fullName))
    .test('verify space', 'You must add your first and last name', async (fullName) => testSpaceInString(fullName)),
});

const updateUserSchema = yup.object().shape({
  phone: yup
    .string()
    .strict(),

  birthdate: yup
    .date()
    .typeError('You must inform a valid date. (eg.: MM/DD/YYYY)')
    .test('valid date', 'Minimum age for registration is 5 years', (birthdate) => testBirthdate(birthdate)),

  email: yup
    .string()
    .strict()
    .email(),

  avatar: yup
    .string()
    .strict()
    .url(),

  comparePassword: yup
    .string()
    .strict()
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),

  newPassword: yup
    .string()
    .strict()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .test('test password', 'password must contain letters numbers and special characters', (password) => testUpdatePassword(password)),

  userName: yup
    .string()
    .strict()
    .min(3)
    .max(30)
    .test('test letters', 'Username must contain only lowercase letters and numbers', async (userName) => testUpdateUserName(userName)),

  fullName: yup
    .string()
    .strict()
    .min(3)
    .test('test letters', 'Name must contain only letters ', (fullName) => testUpdateFullName(fullName))
    .test('test space', 'You must add your first and last name', async (fullName) => testUpdateSpaceInString(fullName)),

  credits: yup
    .number()
    .strict()
    .positive(),

  isActive: yup
    .boolean(),

});

const validateRecoveryPassword = yup.object().shape({
  password: yup
    .string()
    .strict()
    .required()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .test('equal', 'Password must contain letters, numbers and special characters', (password) => testPassword(password)),

  comparePassword: yup
    .string()
    .strict()
    .required()
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

const createUserByAdminSchema = yup.object().shape({
  fullName: yup
    .string()
    .strict()
    .min(3)
    .required()
    .test('verify number', 'Name must contain only letters ', (fullName) => testFullName(fullName))
    .test('verify space', 'You must add your first and last name', async (fullName) => testSpaceInString(fullName)),

  email: yup
    .string()
    .strict()
    .email()
    .required(),

  birthdate: yup
    .date()
    .required()
    .test('valid date', 'Minimum age for registration is 5 years', (birthdate) => testBirthdate(birthdate)),

  phone: yup
    .string()
    .strict(),

  userName: yup
    .string()
    .strict()
    .min(3)
    .max(30)
    .required()
    .test('equal', 'Username must contain only lowercase letters and numbers', async (userName) => testUserName(userName)),

  password: yup
    .string()
    .strict()
    .required()
    .min(8, 'Password must contain at least 8 characters')
    .test('equal', 'Password must contain letters, numbers and special characters', (password) => testPassword(password)),

  comparePassword: yup
    .string()
    .strict()
    .required()
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  validateRecoveryPassword,
  createUserByAdminSchema,
};
