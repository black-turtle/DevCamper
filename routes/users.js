const express = require('express');
// mergeParams is required if we want to merge params coming from other routers
const router = express.Router({ mergeParams: true });
const userController = require('../controllers/users');
const advancedFilter = require('../middlewares/advancedFilter');

const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');
const User = require('../models/User');

router
  .route('/')
  .get(
    authGuard,
    roleGuard('admin'),
    advancedFilter(User),
    userController.getUsers
  )
  .post(authGuard, roleGuard('admin'), userController.addUser);

router
  .route('/:id')
  .get(authGuard, roleGuard('admin'), userController.getUser)
  .put(authGuard, roleGuard('admin'), userController.updateUser)
  .delete(authGuard, roleGuard('admin'), userController.removeUser);

module.exports = router;
