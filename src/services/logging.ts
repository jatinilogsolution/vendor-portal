import { prisma } from "@/lib/prisma";

 
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

export async function createLog(opts: LogOpts) {
  try {
    await prisma.log.create({
      data: {
        userId: opts.userId ?? null,
        vendorId: opts.vendorId ?? null,
        action: opts.action,
        model: opts.model,
        recordId: opts.recordId ?? null,
        oldData: opts.oldData ? JSON.stringify(opts.oldData) : null,
        newData: opts.newData ? JSON.stringify(opts.newData) : null,
        description: opts.description,
      },
    });
  } catch (err) {
     console.error("Failed to create log", err);
  }
}
