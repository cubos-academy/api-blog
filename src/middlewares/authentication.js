const { validateToken } = require("../helpers/handleToken");

const { UserRepository } = require("../repositories/UserRepository");

const userRepository = new UserRepository();

const authentication = async (request, response, next) => {
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      return response
        .status(401)
        .json("You do not have permissions to proceed.");
    }

    const token = authorization.replace("Bearer", "").trim();
    const result = await validateToken(token);

    const { id, email, nickname } = result;

    const user = await userRepository.findOneBy({ id, email, nickname });

    if (!user) {
      return response.status(404).json("Invalid Token");
    }

    const { password, ...userData } = user;

    request.user = userData;

    next();
  } catch (error) {
    return response.status(400).json("Auth Error");
  }
};

module.exports = authentication;
