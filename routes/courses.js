const express = require('express');
// mergeParams is required if we want to merge params coming from other routers
const router = express.Router({ mergeParams: true });

const courseController = require('../controllers/courses');

const advancedFilter = require('../middlewares/advancedFilter');
const Course = require('../models/Course');

const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router
  .route('/')
  .get(
    advancedFilter(Course, { path: 'bootcamp', select: 'name description' }),
    courseController.getCourses
  )
  .post(authGuard, roleGuard('admin', 'publisher'), courseController.addCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(
    authGuard,
    roleGuard('admin', 'publisher'),
    courseController.updateCourse
  )
  .delete(
    authGuard,
    roleGuard('admin', 'publisher'),
    courseController.removeCourse
  );

module.exports = router;
