const { prisma } = require('../../prisma');
const { sendSuccess } = require('../../utils/response');

// GET audit logs
async function getAuditLogs(req, res) {
  const { action, entityType } = req.query;
  const where = {};
  if (action) where.action = String(action);
  if (entityType) where.entityType = String(entityType);

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });

  return sendSuccess(res, logs);
}

module.exports = {
  getAuditLogs
};
