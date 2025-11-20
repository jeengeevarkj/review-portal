import { prisma } from "@/lib/prisma";

export type AuditAction =
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_DELETED"
    | "TASK_ASSIGNED"
    | "COMMENT_ADDED"
    | "USER_UPDATED";

interface LogAuditParams {
    action: AuditAction;
    entity: string;
    entityId: string;
    userId: string;
    details?: Record<string, any>;
}

export async function logAudit({ action, entity, entityId, userId, details }: LogAuditParams) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                userId,
                details: details ? JSON.stringify(details) : undefined,
            },
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // We don't want to fail the main transaction if audit logging fails, 
        // but in a strict system we might want to. For now, just log the error.
    }
}
