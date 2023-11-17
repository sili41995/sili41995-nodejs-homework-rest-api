const express = require('express');
const { verifyEmail } = require('../../controllers/auth');

const router = express.Router();

router.get('/verify/:verificationToken', verifyEmail);

module.exports = router;
