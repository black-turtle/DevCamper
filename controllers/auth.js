const { findByIdAndUpdate } = require('../models/User');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/cookieHelper');
const generatePasswordToken = require('../utils/generatePasswordToken');
const HttpError = require('../utils/HttpError');
const sendEmail = require('../utils/sendEmail');

// @desc Register new user
// @route POST /api/v1/auth/register
// @access public
exports.register = async (req, res, next) => {
  const user = await User.create(req.body);
  sendTokenResponse(user, 201, res);
};

// @desc Login user
// @route POST /api/v1/auth/login
// @access public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new HttpError(`Invalid credentials`, 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new HttpError(`Invalid credentials`, 401);
  }
  sendTokenResponse(user, 200, res);
};

// @desc Logout user
// @route GET /api/v1/auth/logout
// @access Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc get current logged in user
// @route GET /api/v1/auth/me
// @access Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
};

// @desc forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new HttpError(
      `user not found with the email: ${req.body.email}`,
      404
    );
  }

  // update resetPasswordToken in DB
  const updateValue = {
    resetPasswordToken: generatePasswordToken(),
    resetPasswordExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  const updatedUser = await User.findByIdAndUpdate(user._id, updateValue, {
    new: true,
    runValidators: true,
  });

  // send email with resetPasswordToken
  const resetUrl = `${req.protocol}://${req.hostname}/api/v1/auth/resetpassword/${updatedUser.resetPasswordToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset password. Please make PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message: message,
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    throw new HttpError('Send email failed', 500);
  }
};

// @desc reset password using token
// @route GET /api/v1/auth/resetpassword/:token
// @access Private
exports.resetPassword = async (req, res, next) => {
  if (!req.body.password || !req.params.token) {
    throw new HttpError('Invalid arguments', 400);
  }

  // validate token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new HttpError(`Invalid token`, 400);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
};

// @desc update user detail
// @route PUT /api/v1/auth/updatedetails
// @access Private
exports.updateUserDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, findByIdAndUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
};

// @desc update user detail
// @route PUT /api/v1/auth/updatedetails
// @access Private
exports.updateUserDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
};

// @desc update password
// @route PUT /api/v1/auth/updatepassword
// @access Private
exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new HttpError('Invalid arguments', 400);
  }

  if (!(await user.matchPassword(currentPassword))) {
    throw new HttpError('Incorrect password', 401);
  }

  user.password = newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
};
