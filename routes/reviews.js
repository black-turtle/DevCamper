const express = require('express');
// mergeParams is required if we want to merge params coming from other routers
const router = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviews');

const advancedFilter = require('../middlewares/advancedFilter');
const Review = require('../models/Review');

const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router
  .route('/')
  .get(
    advancedFilter(Review, { path: 'bootcamp', select: 'name description' }),
    reviewController.getReviews
  )
  .post(authGuard, roleGuard('admin', 'user'), reviewController.addReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .put(authGuard, roleGuard('admin', 'user'), reviewController.updateReview)
  .delete(authGuard, roleGuard('admin', 'user'), reviewController.removeReview);

module.exports = router;
