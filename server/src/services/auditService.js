import { AuditLog } from '../models/AuditLog.js';

export const logAudit = async ({ adminId, action, entityType, entityId, details = {}, req }) => {
  try {
    const ipAddress = req?.ip || req?.headers['x-forwarded-for'] || '';
    const userAgent = req?.headers['user-agent'] || '';

    await AuditLog.create({
      admin: adminId,
      action,
      entityType,
      entityId: entityId ? entityId.toString() : undefined,
      details,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('[Audit Log Error] Failed to record audit log:', err.message);
  }
};
