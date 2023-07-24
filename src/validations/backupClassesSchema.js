const yup = require('yup');
const { testClassHour, testClassDate } = require('./testsYup');

const requestBackupClassSchema = yup.object().shape({
  classDate: yup
    .date()
    .test('Test Date', 'Class date can not be in the past', (date) => testClassDate(date))
    .required(),

  classStartTime: yup
    .string()
    .when(
      'classDate',
      (classDate, field) => (classDate
        ? field.required().test('Test time', 'Class time can not be in the past', (time) => testClassHour(time, classDate))
        : field),
    ),

  studentId: yup
    .string()
    .strict()
    .uuid()
    .required(),

});

const setBackupClassTeacherSchema = yup.object().shape({
  backupTeacherUserId: yup
    .string()
    .strict()
    .uuid()
    .required(),

});

const validateBackupClassUuidSchema = yup.object().shape({
  backupClassId: yup
    .string()
    .strict()
    .uuid()
    .required(),
});

module.exports = {
  requestBackupClassSchema,
  setBackupClassTeacherSchema,
  validateBackupClassUuidSchema,
};
