const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const auditController = require('./audit.controller');

const router = Router();

// GET audit logs
router.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(auditController.getAuditLogs));

module.exports = router;