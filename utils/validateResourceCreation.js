const HttpError = require('./HttpError');

const validateResourceCreation = (req, publishedResource) => {
  // if user not admin, they can only publish one bootcamp
  if (publishedResource && req.user.role !== 'admin') {
    throw new HttpError(
      `The user with id [${req.user.id}] already published a resource`,
      403
    );
  }
};

module.exports = validateResourceCreation;
