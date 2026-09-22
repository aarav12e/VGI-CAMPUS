const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const analyticsController = require('./analytics.controller');

const router = Router();

// GET Admin Dashboard Analytics
router.get('/dashboard', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(analyticsController.getAdminDashboardAnalytics));

module.exports = router;