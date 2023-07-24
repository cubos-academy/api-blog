const { UserRepository } = require("../repositories/UserRepository");

const userRepository = new UserRepository();

const { generateToken } = require("../helpers/handleToken");
const { comparePasswords } = require("../helpers/handlePassword");

async function login(request, response) {
  const { email, password } = request.body;

  const user = await userRepository.findOneBy({ email });

  if (!user || user.deletedAt) {
    return response.status(404).json("Invalid credentials");
  }

  const verifiedPassword = await comparePasswords(password, user.password);

  if (!verifiedPassword) {
    return response.status(400).json("Invalid credentials");
  }

  const token = await generateToken({ id: user.id, email: user.email });

  return response.status(200).json({ token });
}

module.exports = { login };
