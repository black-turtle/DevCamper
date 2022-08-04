const HttpError = require('./HttpError');

const validateOwnerAccess = (req, ownerId) => {
  // make suer user is admin or owner
  if (ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new HttpError(
      `User with id [${req.user.id}] is not authorized to edit this resource`
    );
  }
};

module.exports = validateOwnerAccess;
