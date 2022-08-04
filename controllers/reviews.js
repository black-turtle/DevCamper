const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');
const HttpError = require('../utils/HttpError');
const validateOwnerAccess = require('../utils/validateOwnerAccess');

// @desc Get Reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReviews = async (req, res, next) => {
  const query = {};
  const bootcampId = req.params.bootcampId;
  if (bootcampId) {
    query.bootcamp = bootcampId;

    const reviews = await Review.find(query).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  }

  return res.status(200).json(res.advancedFilter);
};

// @desc Get single review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    throw new HttpError(`No Review found with id: ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, data: review });
};

// @desc add review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.addReview = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    throw new HttpError(
      `No Bootcamp found with id: ${req.params.bootcampId}`,
      404
    );
  }

  const review = await Review.create({
    ...req.body,
    bootcamp: req.params.bootcampId,
    user: req.user.id,
  });

  res.status(200).json({ success: true, data: review });
};

// @desc update Review
// @route PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new HttpError(`No Review found with id: ${req.params.id}`, 404);
  }

  validateOwnerAccess(req, review.user);

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: updatedReview });
};

// @desc Delete Review
// @route DELETE /api/v1/reviews/:id
// @access Private
exports.removeReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new HttpError(`No Review found with id: ${req.params.id}`, 404);
  }

  validateOwnerAccess(req, review.user);

  await review.remove();

  res.status(200).json({ success: true, data: {} });
};
