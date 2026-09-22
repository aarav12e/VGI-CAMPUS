const { prisma  } = require('../prisma');
async function logAuditAction(params) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress
      }
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
module.exports = { logAuditAction };
