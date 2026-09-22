const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');
const { logAuditAction } = require('../../middleware/audit');

// Departments
async function getDepartments(req, res) {
  const departments = await prisma.department.findMany({
    include: {
      programs: true,
      _count: {
        select: {
          teachers: true,
          students: true
        }
      }
    }
  });
  return sendSuccess(res, departments);
}

async function createDepartment(req, res) {
  const { code, name, description } = req.body;
  const dept = await prisma.department.create({
    data: { code, name, description }
  });
  await logAuditAction({
    userId: req.user?.id,
    action: 'CREATE_DEPARTMENT',
    entityType: 'Department',
    entityId: dept.id,
    details: { code, name }
  });
  return sendSuccess(res, dept, 'Department created', 201);
}

async function getDepartmentOverview(req, res) {
  const { id } = req.params;
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      programs: {
        include: {
          batches: {
            include: {
              semesters: {
                include: {
                  sections: {
                    include: {
                      _count: { select: { students: true } }
                    }
                  }
                }
              }
            }
          },
          subjects: true
        }
      },
      teachers: {
        include: {
          user: { select: { id: true, fullName: true, email: true, phone: true, role: true } },
          teachingAssignments: {
            include: { subject: true, section: true }
          }
        }
      }
    }
  });
  if (!department) {
    return sendError(res, 'NOT_FOUND', 'Department not found', 404);
  }
  return sendSuccess(res, department);
}

// Programs
async function getPrograms(req, res) {
  const programs = await prisma.program.findMany({
    include: {
      department: true,
      batches: {
        include: {
          semesters: {
            include: {
              sections: true
            }
          }
        }
      },
      _count: {
        select: {
          subjects: true,
          students: true
        }
      }
    }
  });
  return sendSuccess(res, programs);
}

async function createProgram(req, res) {
  const { code, name, durationYears, departmentId } = req.body;
  const program = await prisma.program.create({
    data: {
      code,
      name,
      durationYears: Number(durationYears) || 4,
      departmentId
    }
  });
  return sendSuccess(res, program, 'Program created', 201);
}

// Academic Years
async function getAcademicYears(req, res) {
  const years = await prisma.academicYear.findMany({
    orderBy: { startDate: 'desc' }
  });
  return sendSuccess(res, years);
}

async function createAcademicYear(req, res) {
  const { name, startDate, endDate, isCurrent } = req.body;
  if (isCurrent) {
    await prisma.academicYear.updateMany({
      data: { isCurrent: false }
    });
  }
  const year = await prisma.academicYear.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isCurrent: Boolean(isCurrent)
    }
  });
  return sendSuccess(res, year, 'Academic year created', 201);
}

// Batches
async function getBatches(req, res) {
  const batches = await prisma.batch.findMany({
    include: {
      program: true,
      semesters: {
        include: {
          sections: true
        }
      },
      _count: {
        select: {
          students: true
        }
      }
    }
  });
  return sendSuccess(res, batches);
}

async function createBatch(req, res) {
  const { name, programId, startYear, endYear } = req.body;
  const batch = await prisma.batch.create({
    data: {
      name,
      programId,
      startYear: Number(startYear),
      endYear: Number(endYear)
    }
  });
  return sendSuccess(res, batch, 'Batch created', 201);
}

// Semesters
async function getSemesters(req, res) {
  const semesters = await prisma.semester.findMany({
    include: {
      batch: {
        include: {
          program: true
        }
      },
      academicYear: true,
      sections: true
    }
  });
  return sendSuccess(res, semesters);
}

// Sections
async function getSections(req, res) {
  const sections = await prisma.section.findMany({
    include: {
      semester: {
        include: {
          batch: {
            include: {
              program: true
            }
          }
        }
      },
      _count: {
        select: {
          students: true
        }
      }
    }
  });
  return sendSuccess(res, sections);
}

async function createSection(req, res) {
  const { name, semesterId, capacity = 60 } = req.body;
  if (!name || !semesterId) {
    return sendError(res, 'VALIDATION_ERROR', 'Section name and semesterId are required', 400);
  }
  const section = await prisma.section.create({
    data: {
      name: name.trim(),
      semesterId,
      capacity: Number(capacity) || 60
    },
    include: {
      semester: {
        include: {
          batch: {
            include: {
              program: true
            }
          }
        }
      }
    }
  });
  await logAuditAction({
    userId: req.user?.id,
    action: 'CREATE_SECTION',
    entityType: 'Section',
    entityId: section.id,
    details: { name, semesterId, capacity }
  });
  return sendSuccess(res, section, 'Section created successfully', 201);
}

// Subjects
async function getSubjects(req, res) {
  const { programId, semesterNumber } = req.query;
  const whereClause = {};
  if (programId) whereClause.programId = String(programId);
  if (semesterNumber) whereClause.semesterNumber = Number(semesterNumber);
  const subjects = await prisma.subject.findMany({
    where: whereClause,
    include: {
      program: true,
      teachingAssignments: {
        include: {
          teacher: {
            include: {
              user: true
            }
          },
          section: true
        }
      },
      syllabusUnits: true,
      studyMaterials: true
    }
  });
  return sendSuccess(res, subjects);
}

async function createSubject(req, res) {
  const { code, name, credits, type, programId, semesterNumber } = req.body;
  const subject = await prisma.subject.create({
    data: {
      code,
      name,
      credits: Number(credits) || 4,
      type: type || 'THEORY',
      programId,
      semesterNumber: Number(semesterNumber) || 1
    }
  });
  return sendSuccess(res, subject, 'Subject created', 201);
}

module.exports = {
  getDepartments,
  createDepartment,
  getDepartmentOverview,
  getPrograms,
  createProgram,
  getAcademicYears,
  createAcademicYear,
  getBatches,
  createBatch,
  getSemesters,
  getSections,
  createSection,
  getSubjects,
  createSubject
};
