const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const HttpError = require('../utils/HttpError');
const validateOwnerAccess = require('../utils/validateOwnerAccess');

// @desc Get Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = async (req, res, next) => {
  const query = {};
  const bootcampId = req.params.bootcampId;
  if (bootcampId) {
    query.bootcamp = bootcampId;

    const courses = await Course.find(query).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  }

  return res.status(200).json(res.advancedFilter);
};

// @desc Get single Courses
// @route GET /api/v1/courses/:id
// @access public
exports.getCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    throw new HttpError(`No Course found with id: ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, data: course });
};

// @desc add Course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.addCourse = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    throw new HttpError(
      `No Bootcamp found with id: ${req.params.bootcampId}`,
      404
    );
  }

  validateOwnerAccess(req, bootcamp.user);

  const course = await Course.create({
    ...req.body,
    bootcamp: req.params.bootcampId,
  });

  res.status(200).json({ success: true, data: course });
};

// @desc update Course
// @route PUT /api/v1/courses/:id
// @access private
exports.updateCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new HttpError(`No Course found with id: ${req.params.id}`, 404);
  }

  validateOwnerAccess(req, course.user);

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: updatedCourse });
};

// @desc Delete Course
// @route DELETE /api/v1/courses/:id
// @access Private
exports.removeCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new HttpError(`No Course found with id: ${req.params.id}`, 404);
  }
  validateOwnerAccess(req, course.user);

  await course.remove();

  res.status(200).json({ success: true, data: {} });
};
