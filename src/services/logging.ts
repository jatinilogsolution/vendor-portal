import { prisma } from "@/lib/prisma";

/**
 * @deprecated Use auditLog from @/lib/audit-logger instead
 * This function is kept for backward compatibility
 */
type LogOpts = {
  userId?: string | null;
  vendorId?: string | null;
  action: "CREATE" | "UPDATE" | "DELETE" | string;
  model: string;
  recordId?: string | null;
  oldData?: any;
  newData?: any;
  description?: string;
};

/**
 * @deprecated Use auditLog from @/lib/audit-logger for new code
 * This provides basic logging without automatic context capture
 */
export async function createLog(opts: LogOpts) {
  try {
    // Validate required fields
    if (!opts.action || !opts.model) {
      console.error("❌ Audit log missing required fields: action and model are required");
      return;
    }

    await prisma.log.create({
      data: {
        userId: opts.userId ?? null,
        vendorId: opts.vendorId ?? null,
        action: opts.action,
        model: opts.model,
        recordId: opts.recordId ?? null,
        oldData: opts.oldData ? JSON.stringify(opts.oldData) : null,
        newData: opts.newData ? JSON.stringify(opts.newData) : null,
        description: opts.description ?? null,
      },
    });

    console.log(`✅ Log created: ${opts.action} ${opts.model} ${opts.recordId || ''}`);
  } catch (err) {
    // Don't throw - logging failures shouldn't break operations
    console.error("❌ Failed to create log:", err);
    console.error("Log options:", opts);
  }
}
