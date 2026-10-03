const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');
const { logAuditAction } = require('../../middleware/audit');

// Departments
async function getDepartments(req, res) {
  const departments = await prisma.department.findMany({
    include: {
      programs: {
        include: {
          batches: {
            include: {
              semesters: {
                include: {
                  sections: true
                }
              }
            }
          }
        }
      },
      teachers: {
        where: {
          OR: [
            { user: { role: 'HOD' } },
            { designation: { contains: 'Head', mode: 'insensitive' } }
          ]
        },
        include: {
          user: true
        }
      },
      _count: {
        select: {
          teachers: true,
          students: true
        }
      }
    }
  });

  const formatted = departments.map(d => {
    const hodTeacher = d.teachers?.[0];
    return {
      id: d.id,
      code: d.code,
      name: d.name,
      description: d.description,
      programs: d.programs,
      _count: d._count,
      hod: hodTeacher ? {
        id: hodTeacher.user.id,
        name: hodTeacher.user.fullName,
        email: hodTeacher.user.email,
        phone: hodTeacher.user.phone,
        employeeId: hodTeacher.employeeId,
        designation: hodTeacher.designation,
        qualification: hodTeacher.qualification
      } : null
    };
  });

  return sendSuccess(res, formatted);
}

async function assignHod(req, res) {
  const {
    departmentId,
    departmentCode,
    departmentCodes,
    fullName,
    email,
    phone,
    employeeId,
    qualification,
    academicYear,
    academicYears
  } = req.body;

  if (!fullName || !email) {
    return sendError(res, 'VALIDATION_ERROR', 'fullName and email are required', 400);
  }

  // Resolve departments (single or multiple)
  let depts = [];
  if (Array.isArray(departmentCodes) && departmentCodes.length > 0) {
    depts = await prisma.department.findMany({
      where: { code: { in: departmentCodes } }
    });
  } else if (departmentId) {
    const single = await prisma.department.findUnique({ where: { id: departmentId } });
    if (single) depts.push(single);
  } else if (departmentCode) {
    const single = await prisma.department.findUnique({ where: { code: departmentCode } });
    if (single) depts.push(single);
  }

  if (depts.length === 0) {
    const fallbackDept = await prisma.department.findFirst();
    if (fallbackDept) {
      depts.push(fallbackDept);
    } else {
      return sendError(res, 'NOT_FOUND', 'Department not found', 404);
    }
  }

  const primaryDept = depts[0];
  const deptCodesStr = depts.map(d => d.code).join(', ');
  const deptNamesStr = depts.map(d => d.name).join(', ');

  const yearsStr = Array.isArray(academicYears) && academicYears.length > 0
    ? academicYears.join(', ')
    : (academicYear || 'All Years');

  const empIdToUse = employeeId || ('HOD-' + primaryDept.code + '-' + Math.floor(100 + Math.random() * 900));

  let user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash: 'teacher123',
        fullName: fullName.trim(),
        phone: phone || null,
        role: 'HOD',
        isActive: true
      }
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'HOD',
        fullName: fullName.trim(),
        phone: phone || user.phone
      }
    });
  }

  const designation = `HOD (${deptCodesStr} • ${yearsStr})`;

  let teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
  if (!teacher) {
    teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId: empIdToUse,
        departmentId: primaryDept.id,
        designation,
        qualification: qualification || 'Ph.D'
      }
    });
  } else {
    teacher = await prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        departmentId: primaryDept.id,
        designation,
        qualification: qualification || teacher.qualification
      }
    });
  }

  await logAuditAction({
    userId: req.user?.id,
    action: 'ASSIGN_HOD',
    entityType: 'Department',
    entityId: primaryDept.id,
    details: {
      hodName: fullName,
      hodEmail: email,
      departments: deptCodesStr,
      academicYears: yearsStr
    }
  });

  return sendSuccess(res, {
    departments: depts,
    primaryDepartment: primaryDept,
    user,
    teacher,
    assignedDepartments: depts.map(d => d.code),
    academicYears: yearsStr
  }, `Successfully assigned ${fullName} as HOD for ${deptCodesStr} (${yearsStr})`);
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
  let { name, semesterId, programId, programCode, semesterNumber, capacity = 60 } = req.body;
  if (!name) {
    return sendError(res, 'VALIDATION_ERROR', 'Section name is required', 400);
  }

  // Auto-resolve or create semester if program details provided
  if (!semesterId && (programId || programCode) && semesterNumber) {
    let program = null;
    if (programId) {
      program = await prisma.program.findUnique({ where: { id: programId } });
    }
    if (!program && programCode) {
      program = await prisma.program.findFirst({
        where: {
          OR: [
            { code: { equals: programCode, mode: 'insensitive' } },
            { name: { contains: programCode, mode: 'insensitive' } }
          ]
        }
      });
    }

    if (program) {
      let batch = await prisma.batch.findFirst({
        where: { programId: program.id },
        orderBy: { startYear: 'desc' }
      });
      if (!batch) {
        batch = await prisma.batch.create({
          data: {
            name: program.durationYears === 4 ? '2024-2028' : '2024-2027',
            programId: program.id,
            startYear: 2024,
            endYear: 2024 + program.durationYears
          }
        });
      }

      let academicYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } }) ||
                         await prisma.academicYear.findFirst();

      let sem = await prisma.semester.findFirst({
        where: {
          batchId: batch.id,
          number: Number(semesterNumber)
        }
      });
      if (!sem) {
        sem = await prisma.semester.create({
          data: {
            number: Number(semesterNumber),
            batchId: batch.id,
            academicYearId: academicYear.id,
            isCurrent: true
          }
        });
      }
      semesterId = sem.id;
    }
  }

  if (!semesterId) {
    const fallbackSem = await prisma.semester.findFirst();
    if (fallbackSem) {
      semesterId = fallbackSem.id;
    } else {
      return sendError(res, 'VALIDATION_ERROR', 'Valid semesterId or program details are required', 400);
    }
  }

  const trimmedName = name.trim();

  // Check if section already exists in this semester
  const existing = await prisma.section.findFirst({
    where: {
      name: trimmedName,
      semesterId
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
  if (existing) {
    return sendSuccess(res, existing, 'Section already exists in this semester', 200);
  }

  const section = await prisma.section.create({
    data: {
      name: trimmedName,
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
    details: { name: trimmedName, semesterId, capacity }
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
  assignHod,
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
