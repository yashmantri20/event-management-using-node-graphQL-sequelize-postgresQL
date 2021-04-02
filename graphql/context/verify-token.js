const { User } = require("../../database/models");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

module.exports.verifyToken = async (token) => {
  try {
    if (!token) return null;
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};
