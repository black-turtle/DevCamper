const Bootcamp = require('../models/Bootcamp');
const HttpError = require('../utils/HttpError');
const geocoder = require('../config/geocoder');
const path = require('path');
const validateOwnerAccess = require('../utils/validateOwnerAccess');
const validateResourceCreation = require('../utils/validateResourceCreation');

// @desc        Get All bootCamps
// @route       GET /api/v1/bootcamps
// @access      public
exports.getBootCamps = async (req, res, next) => {
  res.status(200).json(res.advancedFilter);
};

// @desc        Get single bootCamp
// @route       GET /api/v1/bootcamps/:id
// @access      public
exports.getBootCamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    throw new HttpError(`Bootcamp not found with id ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, data: bootcamp });
};

// @desc        Create new bootCamp
// @route       POST /api/v1/bootCamps
// @access      private
exports.createBootCamp = async (req, res, next) => {
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  validateResourceCreation(publishedBootcamp);

  const bootcamp = await Bootcamp.create({ ...req.body, user: req.user.id });

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
};

// @desc        Update bootCamp
// @route       PUT /api/v1/bootCamps/:id
// @access      private
exports.updateBootCamp = async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    throw new HttpError(`Bootcamp not found with id ${req.params.id}`, 404);
  }

  validateOwnerAccess(req, bootcamp.user);

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
};

// @desc        Delete bootCamp
// @route       DELETE /api/v1/bootCamps/:id
// @access      private
exports.deleteBootCamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    throw new HttpError(`Bootcamp not found with id ${req.params.id}`, 404);
  }
  validateOwnerAccess(req, bootcamp.user);

  await bootcamp.delete();
  res.status(200).json({ success: true, data: {} });
};

// @desc        Get bootCamp within a radius
// @route       GET /api/v1/bootCamps/radius/:zipcode/:distance
// @access      private
exports.getBootCampsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get latitude/longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;

  // calculate radius using radians
  // divide distance by radius of Earth
  // Earth Radius = 3963 mi or 6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  // send back response
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
};

// @desc        Upload photo for bootCamp
// @route       PUT /api/v1/bootCamps/:id/photo
// @access      private
exports.uploadPhoto = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    throw new HttpError(`Bootcamp not found with id ${req.params.id}`, 404);
  }

  validateOwnerAccess(req, bootcamp.user);

  if (!req.files) {
    throw new HttpError(`Please upload a file`, 400);
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    throw new HttpError(`Please upload a image file`, 400);
  }

  if (req.size > process.env.MAX_FILE_SIZE) {
    throw new HttpError(
      `Please upload a below ${process.env.MAX_FILE_SIZE}`,
      400
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      throw new HttpError('Problem with file upload', 500);
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
};
