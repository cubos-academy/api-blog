const { UserRepository } = require("../repositories/UserRepository");

const userRepository = new UserRepository();

const { generateToken } = require("../helpers/handleToken");
const { comparePasswords } = require("../helpers/handlePassword");

async function login(request, response) {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json("E-mail and password is required");
  }

  const user = await userRepository.findOneBy({ email });

  if (!user) {
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
