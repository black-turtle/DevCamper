const crypto = require('crypto');

const generatePasswordToken = () => {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  return crypto.createHash('sha256').update(resetToken).digest('hex');
};

module.exports = generatePasswordToken;
