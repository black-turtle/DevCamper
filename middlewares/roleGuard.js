const HttpError = require('../utils/HttpError');

const roleGuard =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new HttpError(
        `User role [${req.user.role}] not authorized to access this route`,
        403
      );
    }
    next();
  };
module.exports = roleGuard;
