const express = require('express');
const router = express.Router();

const bootcampController = require('../controllers/bootcamps');

const advancedFilter = require('../middlewares/advancedFilter');
const Bootcamp = require('../models/Bootcamp');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

// Include other resource routers
const courseRouter = require('../routes/courses');
const reviewRouter = require('../routes/reviews');

router
  .route('/')
  .get(advancedFilter(Bootcamp, 'courses'), bootcampController.getBootCamps)
  .post(
    authGuard,
    roleGuard('admin', 'publisher'),
    bootcampController.createBootCamp
  );

router
  .route('/:id')
  .get(bootcampController.getBootCamp)
  .put(
    authGuard,
    roleGuard('admin', 'publisher'),
    bootcampController.updateBootCamp
  )
  .delete(
    authGuard,
    roleGuard('admin', 'publisher'),
    bootcampController.deleteBootCamp
  );

router.use(
  '/:id/photo',
  authGuard,
  roleGuard('admin', 'publisher'),
  bootcampController.uploadPhoto
);

router
  .route('/radius/:zipcode/:distance')
  .get(bootcampController.getBootCampsInRadius);

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

module.exports = router;
