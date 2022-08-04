const express = require('express');
// mergeParams is required if we want to merge params coming from other routers
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/auth');
const authGuard = require('../middlewares/authGuard');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authGuard, authController.logout);
router.get('/me', authGuard, authController.getMe);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword/:token', authController.resetPassword);
router.put('/updatedetails', authGuard, authController.updateUserDetails);
router.put('/updatepassword', authGuard, authController.updatePassword);

module.exports = router;
