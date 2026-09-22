const { Router } = require('express');
const { login, getMe } = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');

const router = Router();

router.post('/login', asyncHandler(login));
router.get('/me', authenticate, asyncHandler(getMe));

module.exports = router;