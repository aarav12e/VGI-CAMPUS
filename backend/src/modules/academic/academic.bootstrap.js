const { prisma } = require('../../prisma');

async function ensureAcademicDepartments() {
  try {
    // 1. Ensure Academic Year 2026-2027
    let academicYear = await prisma.academicYear.findFirst({
      where: { name: '2026-2027' }
    });
    if (!academicYear) {
      academicYear = await prisma.academicYear.create({
        data: {
          name: '2026-2027',
          startDate: new Date('2026-07-01'),
          endDate: new Date('2027-06-30'),
          isCurrent: true
        }
      });
    }

    // 2. Define standard departments & programs across college
    const collegeDepts = [
      {
        code: 'CSE',
        name: 'Department of Computer Science & Engineering',
        description: 'B.Tech Computing, Artificial Intelligence & Software Systems',
        hod: {
          name: 'Dr. Rajesh Sharma',
          email: 'rajesh.sharma@vgi.ac.in',
          empId: 'EMP-CSE-001',
          phone: '+91 98765 00001',
          qualification: 'Ph.D in Computer Science (IIT Delhi)'
        },
        programs: [
          { code: 'BTECH-CSE', name: 'B.Tech Computer Science & Engineering', years: 4, semCount: 8 },
          { code: 'BTECH-DS', name: 'B.Tech Data Science (CSE)', years: 4, semCount: 8 }
        ]
      },
      {
        code: 'PHARM',
        name: 'Department of Pharmaceutical Sciences',
        description: 'Pharmacy Council of India (PCI) approved pharmaceutical education',
        hod: {
          name: 'Dr. Anjali Mehta',
          email: 'anjali.mehta@vgi.ac.in',
          empId: 'EMP-PHARM-001',
          phone: '+91 98765 00002',
          qualification: 'Ph.D in Pharmacology (NIPER)'
        },
        programs: [
          { code: 'BPHARM', name: 'B.Pharma (Bachelor of Pharmacy)', years: 4, semCount: 8 }
        ]
      },
      {
        code: 'MGMT',
        name: 'Department of Management Studies',
        description: 'Business Administration, Finance, Marketing & Operations',
        hod: {
          name: 'Dr. Vikram Kapoor',
          email: 'vikram.kapoor@vgi.ac.in',
          empId: 'EMP-MGMT-001',
          phone: '+91 98765 00003',
          qualification: 'Ph.D in Management (IIM Lucknow)'
        },
        programs: [
          { code: 'BBA', name: 'BBA (Bachelor of Business Administration)', years: 3, semCount: 6 }
        ]
      },
      {
        code: 'CA',
        name: 'Department of Computer Applications',
        description: 'Application Development, Software Engineering & Cloud Systems',
        hod: {
          name: 'Dr. Sunita Rao',
          email: 'sunita.rao@vgi.ac.in',
          empId: 'EMP-CA-001',
          phone: '+91 98765 00004',
          qualification: 'Ph.D in Computer Applications (JNU)'
        },
        programs: [
          { code: 'BCA', name: 'BCA (Bachelor of Computer Applications)', years: 3, semCount: 6 }
        ]
      }
    ];

    for (const d of collegeDepts) {
      // Find or create department
      let dept = await prisma.department.findUnique({ where: { code: d.code } });
      if (!dept) {
        dept = await prisma.department.create({
          data: {
            code: d.code,
            name: d.name,
            description: d.description
          }
        });
      }

      // Ensure HOD user and teacher profile
      if (d.hod) {
        let hodUser = await prisma.user.findUnique({ where: { email: d.hod.email } });
        if (!hodUser) {
          hodUser = await prisma.user.create({
            data: {
              email: d.hod.email,
              passwordHash: 'teacher123',
              role: 'HOD',
              fullName: d.hod.name,
              phone: d.hod.phone,
              isActive: true
            }
          });
        } else if (hodUser.role !== 'HOD') {
          await prisma.user.update({
            where: { id: hodUser.id },
            data: { role: 'HOD' }
          });
        }

        let hodTeacher = await prisma.teacher.findUnique({ where: { userId: hodUser.id } });
        if (!hodTeacher) {
          await prisma.teacher.create({
            data: {
              userId: hodUser.id,
              employeeId: d.hod.empId,
              departmentId: dept.id,
              designation: `Head of Department (${dept.name})`,
              qualification: d.hod.qualification
            }
          });
        }
      }

      // Ensure programs, batches, semesters, and sections
      for (const p of d.programs) {
        let prog = await prisma.program.findUnique({ where: { code: p.code } });
        if (!prog) {
          prog = await prisma.program.create({
            data: {
              code: p.code,
              name: p.name,
              durationYears: p.years,
              departmentId: dept.id
            }
          });
        }

        // Active Batch
        let batch = await prisma.batch.findFirst({ where: { programId: prog.id } });
        if (!batch) {
          batch = await prisma.batch.create({
            data: {
              name: p.years === 4 ? '2024-2028' : '2024-2027',
              programId: prog.id,
              startYear: 2024,
              endYear: 2024 + p.years
            }
          });
        }

        // Semesters
        for (let sNum = 1; sNum <= p.semCount; sNum++) {
          let sem = await prisma.semester.findFirst({
            where: { batchId: batch.id, number: sNum }
          });
          if (!sem) {
            sem = await prisma.semester.create({
              data: {
                number: sNum,
                batchId: batch.id,
                academicYearId: academicYear.id,
                isCurrent: sNum === 3 || sNum === 5
              }
            });
          }

          // Sections: A, B, C for each semester
          for (const sName of ['Section A', 'Section B', 'Section C']) {
            let sec = await prisma.section.findFirst({
              where: { semesterId: sem.id, name: sName }
            });
            if (!sec) {
              await prisma.section.create({
                data: {
                  name: sName,
                  semesterId: sem.id,
                  capacity: 60
                }
              });
            }
          }
        }
      }
    }

    console.log('✅ Academic departments (B.Tech, B.Pharma, BBA, BCA), HODs, & sections verified.');
  } catch (error) {
    console.error('Academic bootstrap warning:', error.message);
  }
}

module.exports = { ensureAcademicDepartments };
