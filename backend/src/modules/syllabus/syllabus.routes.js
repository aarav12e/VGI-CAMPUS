const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const syllabusController = require('./syllabus.controller');

const router = Router();

// GET syllabus units for a subject
router.get('/subject/:subjectId', authenticate, asyncHandler(syllabusController.getSubjectSyllabus));

// CREATE syllabus unit
router.post('/units', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), asyncHandler(syllabusController.createSyllabusUnit));

// CREATE study material
router.post('/materials', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), asyncHandler(syllabusController.createStudyMaterial));

module.exports = router;