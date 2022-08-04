const User = require('../models/User');
const HttpError = require('../utils/HttpError');

// @desc get users
// @route GET /api/v1/users
// @access Private
exports.getUsers = async (req, res, next) => {
  return res.status(200).json(res.advancedFilter);
};

// @desc get users
// @route POST /api/v1/users
// @access Private
exports.addUser = async (req, res, next) => {
  const user = await User.create(req.body);
  user.password = undefined;
  return res.status(200).json({ success: true, data: user });
};

// @desc get user by id
// @route GET /api/v1/users/:id
// @access Private
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new HttpError(`No User found with id: ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: user });
};

// @desc update user data
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    throw new HttpError(`No User found with id: ${req.params.id}`, 404);
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
};

// @desc remove user
// @route PUT /api/v1/users/:id
// @access Private
exports.removeUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new HttpError(`No User found with id: ${req.params.id}`, 404);
  }
  await User.findByIdAndRemove(req.params.id);
  res.status(200).json({ success: true, data: {} });
};
