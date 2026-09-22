const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');

// GET syllabus units for a subject
async function getSubjectSyllabus(req, res) {
  const { subjectId } = req.params;
  const units = await prisma.syllabusUnit.findMany({
    where: { subjectId },
    orderBy: { unitNumber: 'asc' }
  });
  const materials = await prisma.studyMaterial.findMany({
    where: { subjectId },
    include: {
      teacher: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: { program: true }
  });
  return sendSuccess(res, {
    subject,
    units,
    materials
  });
}

// CREATE syllabus unit
async function createSyllabusUnit(req, res) {
  const { subjectId, unitNumber, title, topics } = req.body;
  const unit = await prisma.syllabusUnit.create({
    data: {
      subjectId,
      unitNumber: Number(unitNumber),
      title,
      topics: typeof topics === 'string' ? topics : JSON.stringify(topics)
    }
  });
  return sendSuccess(res, unit, 'Syllabus unit created', 201);
}

// CREATE study material
async function createStudyMaterial(req, res) {
  const {
    subjectId,
    title,
    description,
    fileUrl,
    fileType = 'PDF',
    unitNumber
  } = req.body;

  let teacherId = req.user?.teacherId;
  if (!teacherId) {
    const anyTeacher = await prisma.teacher.findFirst();
    teacherId = anyTeacher?.id;
  }
  if (!teacherId) {
    return sendError(res, 'FORBIDDEN', 'Teacher profile required', 403);
  }

  const material = await prisma.studyMaterial.create({
    data: {
      subjectId,
      teacherId,
      title,
      description,
      fileUrl,
      fileType,
      unitNumber: unitNumber ? Number(unitNumber) : null
    },
    include: {
      teacher: {
        include: { user: true }
      }
    }
  });
  return sendSuccess(res, material, 'Study material uploaded successfully', 201);
}

module.exports = {
  getSubjectSyllabus,
  createSyllabusUnit,
  createStudyMaterial
};
