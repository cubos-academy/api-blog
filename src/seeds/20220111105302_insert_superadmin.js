const { generateUuid } = require("../helpers/handleUuid");
const { encryptPassword } = require("../helpers/handlePassword");

exports.seed = async function (knex) {
  const encryptedPassword = await encryptPassword("lop32145");

  const superAdmin = {
    id: generateUuid(),
    name: "Daniel",
    email: "daniel.lopes@cubos.academy",
    password: encryptedPassword,
  };

  await knex("users").insert(superAdmin);
};
