const { UserRepository } = require('../repositories/UserRepository');
const { StudentRepository } = require('../repositories/StudentRepository');
const { TeacherRepository } = require('../repositories/TeacherRepository');
const { PlansRepository } = require('../repositories/PlansRepository');
const { AdditionalServicesRepository } = require('../repositories/AdditionalServicesRepository');
const { BenefitsRepository } = require('../repositories/BenefitsRepository');
const { PlansBenefitsRepository } = require('../repositories/PlansBenefitsRepository');

const userRepository = new UserRepository();
const studentRepository = new StudentRepository();
const teacherRepository = new TeacherRepository();
const plansRepository = new PlansRepository();
const additionalServicesRepository = new AdditionalServicesRepository();
const benefitsRepository = new BenefitsRepository();
const plansBenefitsRepository = new PlansBenefitsRepository();

const { formatDate } = require('./handleDate');

const err = {
  success: true,
  message: '',
};

function generateError(success, message) {
  const erro = {
    success,
    message,
  };

  return erro;
}

async function verifyPlans(planId, userType) {
  let error = err;

  const plans = await plansRepository.findOneBy({ id: planId, type: userType });

  if (!plans) {
    error = generateError(false, 'Plan not found');
  }
  return error;
}

async function verifyAdditionalService(serviceId) {
  let error = err;

  const service = await additionalServicesRepository.findOneBy({ id: serviceId });

  if (!service) {
    error = generateError(false, 'Additional service not found');
  }
  return error;
}

async function verifyAccessRights(allowedUsers, userType) {
  let error = err;

  if (!allowedUsers.includes(userType)) {
    error = generateError(false, 'You do not have permission to proceed.');
  }
  return error;
}

async function verifyUserType(allowedUsers, userType) {
  let error = err;

  if (!allowedUsers.includes(userType)) {
    error = generateError(false, 'Invalid user type.');
  }

  return error;
}

async function verifyDuplicatedUsers(userName) {
  let error = err;

  const registeredUser = await userRepository.findOneBy({ userName });

  if (registeredUser) {
    error = generateError(false, 'This username is not available. Inform a different username.');
  }
  return error;
}

async function verifyDuplicatedUsersNotIncludeMyUser(userId, userName) {
  let error = err;

  const registeredUser = await userRepository.findOneBy({ userName });

  if (registeredUser && registeredUser.id !== userId) {
    error = generateError(false, 'This username is not available. Inform a different username.');
  }
  return error;
}

async function verifyDuplicatedPlan() {
  const planNames = [];

  const registeredPlans = await plansRepository.findAll();

  if (registeredPlans.length) {
    for (const plan of registeredPlans) {
      planNames.push(plan.name);
    }
  }

  return planNames;
}

async function verifyDuplicatedAdditionalService() {
  const serviceNames = [];

  const registeredServices = await additionalServicesRepository.findAll();

  if (registeredServices.length) {
    for (const service of registeredServices) {
      serviceNames.push(service.name);
    }
  }

  return serviceNames;
}

async function verifyDuplicatedBenefit() {
  const benefitsDescriptions = [];

  const registeredBenefits = await benefitsRepository.findAll();

  if (registeredBenefits.length) {
    for (const benefit of registeredBenefits) {
      benefitsDescriptions.push(benefit.description.toLowerCase());
    }
  }

  return benefitsDescriptions;
}

async function verifyDuplicatedPlanBenefit(benefits) {
  const registeredPlanBenefits = await plansBenefitsRepository.findAll();

  const verifiedBenefits = [];

  for (const benefit of benefits) {
    const registeredBenefit = registeredPlanBenefits.filter(
      (element) => benefit.planId === element.planId && benefit.benefitId === element.benefitId,
    );

    if (!registeredBenefit.length) {
      verifiedBenefits.push(benefit);
    }
  }
  return verifiedBenefits;
}

function clearUserObject(user) {
  delete user.isActive;
  delete user.deletedAt;
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.rejectedAt;

  return user;
}

function formattedName(user) {
  const { firstName, lastName: lastNames } = user;

  user.fullName = `${firstName} ${lastNames}`;
  user.shortName = `${firstName} ${user.fullName.split(' ').pop()}`;

  delete user.firstName;
  delete user.lastName;
}

function formattedArrayUsers(users) {
  for (const user of users) {
    const { createdAt, birthdate } = user;

    user.accountCreationDate = formatDate(createdAt);
    user.birthdate = formatDate(birthdate);
    user.status = user.isActive ? 'Active user' : 'Suspended user';

    delete user.createdAt;

    formattedName(user);
  }

  return users;
}

function separateFirstNameAndLastName(fullName) {
  const userName = {};
  if (fullName) {
    const fullNameInArray = fullName.trim().split(' ');

    const firstName = fullNameInArray[0];
    const lastName = fullNameInArray.slice(1, fullNameInArray.length).join(' ');

    userName.firstName = firstName.trim();
    userName.lastName = lastName.trim();
  }

  return userName;
}

function validateTestsRegEx(info, params) {
  const testing = params.map((validation) => validation.test(info));
  return testing;
}

function verifyEmptyObject(object) {
  return JSON.stringify(object) === '{}';
}

async function verifyTeacher(student, teacherId) {
  let error = err;
  if (teacherId !== student.teacherId && teacherId !== student.backupTeacherId) {
    error = generateError(false, 'Teacher can not create classes for this student.');
  }
  return error;
}

async function verifyUserDetails(user) {
  let validation = err;

  if (user.userType === 'Student') {
    const student = await studentRepository.getStudentByUserId(user.id);
    if (!student) {
      validation = generateError(false, 'No student details found');
      return validation;
    }

    const teacherData = {};

    let teacher;

    if (student.backupTeacherId) {
      teacher = await teacherRepository.findOneBy({ id: student.backupTeacherId });

      if (!teacher) {
        validation = generateError(false, 'No teacher details found');
        return validation;
      }
      teacherData.role = 'Backup Teacher';
    } else {
      teacher = await teacherRepository.findOneBy({ id: student.teacherId });

      if (!teacher) {
        validation = generateError(false, 'No teacher details found');
        return validation;
      }
      teacherData.role = 'Full Teacher';
    }

    const teacherUser = await userRepository.findOneBy({ id: teacher.userId });

    if (!teacherUser) {
      validation = generateError(false, 'No teacher details found');
      return validation;
    }

    teacherData.fullName = `${teacherUser.firstName} ${teacherUser.lastName}`;
    teacherData.email = teacherUser.email;
    teacherData.avatar = teacherUser.avatar;
    teacherData.phone = teacherUser.phone;

    validation.userInfo = student;
    validation.userInfo.teacherInfo = teacherData;
    return validation;
  }

  const teacher = await teacherRepository.getTeacherByUserId(user.id);
  if (!teacher) {
    validation = generateError(false, 'No teacher details found');
    return validation;
  }
  validation.userInfo = teacher;

  return validation;
}

module.exports = {
  verifyAccessRights,
  verifyPlans,
  verifyAdditionalService,
  verifyUserType,
  verifyDuplicatedPlan,
  verifyDuplicatedUsers,
  verifyDuplicatedAdditionalService,
  verifyDuplicatedBenefit,
  verifyDuplicatedPlanBenefit,
  clearUserObject,
  formattedName,
  formattedArrayUsers,
  separateFirstNameAndLastName,
  validateTestsRegEx,
  verifyEmptyObject,
  verifyTeacher,
  verifyUserDetails,
  verifyDuplicatedUsersNotIncludeMyUser,
};
