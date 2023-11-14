const express = require('express');
const {
  register,
  login,
  logout,
  refresh,
  updateSubscription,
  updateAvatar,
} = require('../../controllers/users');
const {
  registerSchema,
  loginSchema,
  updateSubscriptionUserSchema,
} = require('../../models/user');
const { authenticate, validateBody, upload } = require('../../middlewares');

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.post('/logout', authenticate, logout);

router.get('/current', authenticate, refresh);

router.patch(
  '/',
  authenticate,
  validateBody(updateSubscriptionUserSchema),
  updateSubscription
);

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatarURL'),
  updateAvatar
);

module.exports = router;
