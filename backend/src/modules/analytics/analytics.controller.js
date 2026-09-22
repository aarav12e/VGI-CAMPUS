const { prisma } = require('../../prisma');
const { sendSuccess } = require('../../utils/response');

// GET Admin Dashboard Analytics
async function getAdminDashboardAnalytics(req, res) {
  const [
    totalStudents,
    totalTeachers,
    totalDepartments,
    totalPrograms,
    totalBatches,
    totalSubjects,
    attendanceSessionsCount,
    attendanceRecords,
    hostelRooms,
    noticesCount,
    eventsCount
  ] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.department.count(),
    prisma.program.count(),
    prisma.batch.count(),
    prisma.subject.count(),
    prisma.attendanceSession.count(),
    prisma.attendanceRecord.findMany({
      select: { isPresent: true }
    }),
    prisma.hostelRoom.findMany(),
    prisma.notice.count(),
    prisma.event.count()
  ]);

  // Average attendance rate
  const totalRecs = attendanceRecords.length;
  const presentRecs = attendanceRecords.filter(r => r.isPresent).length;
  const averageAttendance = totalRecs > 0 ? Math.round(presentRecs / totalRecs * 100) : 88;

  // Hostel occupancy
  const totalHostelCapacity = hostelRooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalHostelOccupied = hostelRooms.reduce((acc, r) => acc + r.occupied, 0);
  const hostelOccupancyRate = totalHostelCapacity > 0 ? Math.round(totalHostelOccupied / totalHostelCapacity * 100) : 85;

  // Current academic year
  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true }
  });

  // Recent audit activities
  const recentAuditLogs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 6
  });

  return sendSuccess(res, {
    stats: {
      totalStudents,
      totalTeachers,
      totalDepartments,
      totalPrograms,
      totalBatches,
      totalSubjects,
      attendanceSessionsCount,
      averageAttendance,
      totalHostelCapacity,
      totalHostelOccupied,
      hostelOccupancyRate,
      noticesCount,
      eventsCount,
      currentAcademicYear: currentAcademicYear?.name || '2026-2027'
    },
    recentAuditLogs
  });
}

module.exports = {
  getAdminDashboardAnalytics
};
