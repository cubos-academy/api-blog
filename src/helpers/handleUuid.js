const uuid = require('uuid');

const generateUuid = (info) => {
  const newUuid = uuid.v4(info);
  return newUuid;
};

const validateUuid = (info) => {
  const validUuid = uuid.validate(info);

  if (validUuid) { return true; }
  return false;
};

module.exports = {
  generateUuid,
  validateUuid,
};
