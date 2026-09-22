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

module.exports = {
  getHostelRooms,
  getHostelComplaints,
  createHostelComplaint,
  updateHostelComplaintStatus,
  getMessMenu,
  updateMessMenu,
  getLibraryBooks,
  getMyLibraryBooks,
  getMyFee
};
