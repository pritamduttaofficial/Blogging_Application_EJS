const JWT = require("jsonwebtoken");
const secret = "$Pr!tam123";

function createUserToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };

  const token = JWT.sign(payload, secret);
  return token;
}

function verifyUserToken(token) {
  const user = JWT.verify(token, secret);
  return user;
}

module.exports = {
  createUserToken,
  verifyUserToken,
};
