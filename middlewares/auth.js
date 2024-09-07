const { verifyUserToken } = require("../utils/authentication");

function checkForCookieAuthentication(cookieName) {
  return (req, res, next) => {
    const tokenCookie = req.cookies[cookieName];
    if (!tokenCookie) {
      return next();
    }
    try {
      const userPayload = verifyUserToken(tokenCookie);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}

module.exports = checkForCookieAuthentication;
