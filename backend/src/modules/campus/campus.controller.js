const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');
const { logAuditAction } = require('../../middleware/audit');

// HOSTEL & COMPLAINTS
async function getHostelRooms(req, res) {
  const rooms = await prisma.hostelRoom.findMany({
    orderBy: [
      { hostelName: 'asc' },
      { roomNumber: 'asc' }
    ]
  });
  return sendSuccess(res, rooms);
}

async function getHostelComplaints(req, res) {
  const where = {};
  if (req.user?.role === 'STUDENT') {
    where.studentId = req.user.studentId;
  } else if (req.user?.role === 'PARENT') {
    where.student = {
      guardianName: req.user.fullName
    };
  } else if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
    where.student = {
      userId: req.user.id
    };
  }
  const complaints = await prisma.hostelComplaint.findMany({
    where,
    include: {
      student: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return sendSuccess(res, complaints);
}

async function createHostelComplaint(req, res) {
  const { roomNumber, category, description } = req.body;
  const studentId = req.user?.studentId;
  if (!studentId || !roomNumber || !category || !description) {
    return sendError(res, 'VALIDATION_ERROR', 'All complaint fields are required', 400);
  }
  const complaint = await prisma.hostelComplaint.create({
    data: {
      studentId,
      roomNumber,
      category,
      description,
      status: 'PENDING'
    }
  });
  return sendSuccess(res, complaint, 'Complaint submitted successfully', 201);
}

async function updateHostelComplaintStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const complaint = await prisma.hostelComplaint.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === 'RESOLVED' ? new Date() : undefined
    }
  });
  await logAuditAction({
    userId: req.user?.id,
    action: 'UPDATE_COMPLAINT_STATUS',
    entityType: 'HostelComplaint',
    entityId: id,
    details: { status }
  });
  return sendSuccess(res, complaint, 'Complaint status updated');
}

// MESS MENU
async function getMessMenu(req, res) {
  const menu = await prisma.messMenu.findMany();
  return sendSuccess(res, menu);
}

async function updateMessMenu(req, res) {
  const {
    dayOfWeek,
    breakfast,
    lunch,
    dinner,
    specialMeal
  } = req.body;
  const menu = await prisma.messMenu.upsert({
    where: { dayOfWeek: dayOfWeek.toUpperCase() },
    update: {
      breakfast,
      lunch,
      dinner,
      specialMeal
    },
    create: {
      dayOfWeek: dayOfWeek.toUpperCase(),
      breakfast,
      lunch,
      dinner,
      specialMeal
    }
  });
  return sendSuccess(res, menu, 'Mess menu updated');
}

// LIBRARY
async function getLibraryBooks(req, res) {
  const { search, category } = req.query;
  const where = {};
  if (category) where.category = String(category);
  if (search) {
    const q = String(search);
    where.OR = [
      { title: { contains: q } },
      { author: { contains: q } },
      { isbn: { contains: q } }
    ];
  }
  const books = await prisma.libraryBook.findMany({
    where,
    orderBy: { title: 'asc' }
  });
  return sendSuccess(res, books);
}

async function getMyLibraryBooks(req, res) {
  const studentId = req.user?.studentId;
  if (!studentId) return sendError(res, 'FORBIDDEN', 'Student profile required', 403);
  const txs = await prisma.libraryTransaction.findMany({
    where: { studentId },
    include: { book: true },
    orderBy: { issuedAt: 'desc' }
  });
  return sendSuccess(res, txs);
}

// FEES
async function getMyFee(req, res) {
  const studentId = req.user?.studentId;
  if (!studentId) return sendError(res, 'FORBIDDEN', 'Student profile required', 403);
  const fee = await prisma.studentFee.findFirst({
    where: { studentId },
    orderBy: { updatedAt: 'desc' }
  });
  return sendSuccess(res, fee);
}

// =========================================================================
// CAMPUS EVENTS, FESTS & HACKATHONS
// =========================================================================

async function getEvents(req, res) {
  const events = await prisma.event.findMany({
    include: {
      registrations: {
        include: {
          student: {
            include: {
              user: {
                select: { fullName: true, email: true, phone: true }
              },
              department: {
                select: { code: true, name: true }
              },
              program: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { registeredAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return sendSuccess(res, events);
}

async function createEvent(req, res) {
  const { title, description, category, venue, date, startTime, endTime, maxParticipants, prize } = req.body;
  if (!title || !venue) {
    return sendError(res, 'VALIDATION_ERROR', 'Title and venue are required', 400);
  }

  const desc = prize ? `${description || ''} • Prize: ${prize}` : (description || title);

  const event = await prisma.event.create({
    data: {
      title: title.trim(),
      description: desc.trim(),
      category: category || 'Hackathons',
      venue: venue.trim(),
      date: date || new Date().toISOString().split('T')[0],
      startTime: startTime || '10:00 AM',
      endTime: endTime || '05:00 PM',
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : 500,
      isPublished: true
    }
  });

  await logAuditAction({
    userId: req.user?.id,
    action: 'CREATE_CAMPUS_EVENT',
    entityType: 'Event',
    entityId: event.id,
    details: { title: event.title, category: event.category, venue: event.venue }
  });

  return sendSuccess(res, event, 'Event created successfully', 201);
}

async function deleteEvent(req, res) {
  const { id } = req.params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return sendError(res, 'NOT_FOUND', 'Event not found', 404);
  }

  await prisma.event.delete({ where: { id } });

  await logAuditAction({
    userId: req.user?.id,
    action: 'DELETE_CAMPUS_EVENT',
    entityType: 'Event',
    entityId: id,
    details: { title: event.title }
  });

  return sendSuccess(res, { id }, 'Event deleted successfully');
}

async function registerForEvent(req, res) {
  const { id } = req.params;
  const studentId = req.user?.studentId;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return sendError(res, 'NOT_FOUND', 'Event not found', 404);
  }

  let student = null;
  if (studentId) {
    student = await prisma.student.findUnique({ where: { id: studentId } });
  } else {
    student = await prisma.student.findFirst();
  }

  if (!student) {
    return sendError(res, 'NOT_FOUND', 'Student record required to register', 404);
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: {
      eventId_studentId: {
        eventId: id,
        studentId: student.id
      }
    }
  });

  if (existing) {
    await prisma.eventRegistration.delete({
      where: { id: existing.id }
    });
    return sendSuccess(res, { registered: false }, 'Registration cancelled');
  } else {
    const reg = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        studentId: student.id
      }
    });
    return sendSuccess(res, { registered: true, registration: reg }, 'Registration confirmed');
  }
}

async function getEventRegistrations(req, res) {
  const { id } = req.params;
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId: id },
    include: {
      student: {
        include: {
          user: { select: { fullName: true, email: true, phone: true } },
          department: { select: { code: true, name: true } },
          program: { select: { name: true } }
        }
      }
    },
    orderBy: { registeredAt: 'desc' }
  });
  return sendSuccess(res, registrations);
}

module.exports = {
  getHostelRooms,
  getHostelComplaints,
  createHostelComplaint,
  updateHostelComplaintStatus,
  getMessMenu,
  updateMessMenu,
  getLibraryBooks,
  getMyLibraryBooks,
  getMyFee,
  getEvents,
  createEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations
};
