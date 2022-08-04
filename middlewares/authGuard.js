const HttpError = require('../utils/HttpError');
var jwt = require('jsonwebtoken');
const User = require('../models/User');

const authGuard = async (req, res, next) => {
  const { authorization } = req.headers;

  let token;
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.split(' ')[1];
  } else {
    token = req.cookies.token;
  }

  if (!token) {
    throw new HttpError('Not authorized to access this route', 401);
  }

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      throw new HttpError('Not authorized to access this route', 401);
    }

    next();
  } catch (err) {
    throw new HttpError('Not authorized to access this route', 401);
  }
};

module.exports = authGuard;
