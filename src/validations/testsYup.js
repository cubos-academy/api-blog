const {
  validateTestsRegEx,
  verifyAccessRights,
  verifyEmptyObject,
} = require('../helpers/utils');

const {
  checkIsValidDate,
  addTime,
  checkIsSameDate,
} = require('../helpers/handleDate');

const testCredits = (credits) => {
  if (credits) {
    const test = credits % 4 === 0;
    return test;
  }
  return true;
};

const testBirthdate = async (birthdate) => {
  if (birthdate) {
    const birthDate = new Date(birthdate);
    const minAge = addTime(new Date(), { years: -5 });
    const test = await checkIsValidDate(minAge, birthDate);
    return test;
  }
  return true;
};

const testPassword = (password) => {
  const passwordTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[!|@|#|$|%|&|*|(|)|-|_|+|=|^]/];
  const test = validateTestsRegEx(password.trim(), passwordTest);
  return test.every((pwd) => pwd);
};

const testFullName = (fullName) => {
  const nameTest = [/[0-9]/, /[!|@|#|$|%|&|*|(|)|-|_|+|=|^]/];
  const test = validateTestsRegEx(fullName.trim(), nameTest);
  return test.every((pwd) => !pwd);
};

const testUserName = (userName) => {
  const userNameTest = [/[A-Z]/, /[!|@|#|$|%|&|*|(|)|-|_|+|=|^]/];
  const test = validateTestsRegEx(userName.trim(), userNameTest);
  return test.every((tst) => !tst);
};

const testClassTime = (classTime) => {
  const test = classTime === 'dynamic' || classTime === 'business';
  return test;
};

const testSpaceInString = (string) => {
  const test = string.trim().indexOf(' ') >= 1;
  return test;
};

const validateUsertype = async (allowedUsers, userType) => {
  const { success } = await verifyAccessRights(allowedUsers, userType);
  return success;
};

const testEmptyObject = async (object) => {
  const test = verifyEmptyObject(object);
  return !test;
};

const testUpdateFullName = (fullName) => {
  if (fullName) {
    const nameTest = [/[0-9]/, /[!|@|#|$|%|&|*|(|)|-|_|+|=|^]/];
    const test = validateTestsRegEx(fullName.trim(), nameTest);
    return test.every((pwd) => !pwd);
  }
  return true;
};

const testUpdatePassword = (password) => {
  if (password) {
    const passwordTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[!|@|#|$|%|&|*|(|)|-|_|+|=|^]/];
    const test = validateTestsRegEx(password.trim(), passwordTest);
    return test.every((pwd) => pwd);
  }
  return true;
};

const testUpdateUserName = (userName) => {
  if (userName) {
    const userNameTest = [/[A-Z]/, /[!|@|#|$|%|&|*|(|)|-|_|+|=|^]/];
    const test = validateTestsRegEx(userName.trim(), userNameTest);
    return test.every((tst) => !tst);
  }
  return true;
};

const testUpdateClassTime = (classTime) => {
  if (classTime) {
    const test = classTime === 'dynamic' || classTime === 'business';
    return test;
  }
  return true;
};

const testUpdateSpaceInString = (string) => {
  if (string) {
    const test = string.trim().indexOf(' ') >= 1;
    return test;
  }
  return true;
};

const testClassDate = async (date) => {
  const informedDate = new Date(date);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const isFutureDate = await checkIsValidDate(informedDate, currentDate);

  const isSameDate = await checkIsSameDate(informedDate, currentDate);

  if (!isFutureDate && !isSameDate) {
    return false;
  }
  return true;
};

const testClassHour = async (time, date) => {
  const informedDate = new Date(date);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const isSameDate = await checkIsSameDate(informedDate, currentDate);

  if (isSameDate) {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const requestDate = new Date(`${currentDate.toDateString()} ${time}`);
    const requestHour = requestDate.getHours();
    const requestMinutes = requestDate.getMinutes();

    if (requestHour > currentHour
      || (requestHour === currentHour
        && requestMinutes > currentMinutes)) {
      return true;
    }
    return false;
  }

  return true;
};

module.exports = {
  testCredits,
  testBirthdate,
  testPassword,
  testFullName,
  testUserName,
  testClassTime,
  testEmptyObject,
  validateUsertype,
  testSpaceInString,
  testUpdateFullName,
  testUpdatePassword,
  testUpdateUserName,
  testUpdateClassTime,
  testUpdateSpaceInString,
  testClassDate,
  testClassHour,
};
