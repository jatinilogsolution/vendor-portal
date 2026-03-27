// src/lib/vendor-portal/audit.ts
// Uses existing Log table — no new table needed.
import { prisma } from "@/lib/prisma"
import { VpEntityType } from "@/types/vendor-portal"

interface LogVpAuditParams {
  userId?: string
  vendorId?: string
  action: "CREATE" | "UPDATE" | "DELETE"
  entityType: VpEntityType
  entityId?: string
  oldData?: object | null
  newData?: object | null
  description?: string
}

export async function logVpAudit(p: LogVpAuditParams): Promise<void> {
  try {
    await prisma.log.create({
      data: {
        userId: p.userId ?? null,
        vendorId: p.vendorId ?? null,
        action: p.action,
        model: p.entityType,
        recordId: p.entityId ?? null,
        oldData: p.oldData ? JSON.stringify(p.oldData) : null,
        newData: p.newData ? JSON.stringify(p.newData) : null,
        description: p.description ?? null,
      },
    })
  } catch (e) {
    console.error("[logVpAudit]", e)
  }
}