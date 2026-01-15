 import { prisma } from "@/lib/prisma";
import { createLog } from "./logging";

export async function createLRRequest(data: any, sessionUser: any) {
  const newRecord = await prisma.lRRequest.create({ data }); // adjust type/field names as needed

  await createLog({
    userId: sessionUser?.id ?? null,
    vendorId: sessionUser?.vendorId ?? null,
    action: "CREATE",
    model: "LRRequest",
    recordId: newRecord.id,
    newData: newRecord,
    description: `Created LRRequest ${newRecord.id}`,
  });

  return newRecord;
}

export async function updateLRRequest(id: string, updateData: any, sessionUser: any) {
  const before = await prisma.lRRequest.findUnique({ where: { id } });
  const updated = await prisma.lRRequest.update({
    where: { id },
    data: updateData,
  });

  await createLog({
    userId: sessionUser?.id ?? null,
    vendorId: sessionUser?.vendorId ?? null,
    action: "UPDATE",
    model: "LRRequest",
    recordId: id,
    oldData: before,
    newData: updated,
    description: `Updated LRRequest ${id}`,
  });

  return updated;
}

export async function deleteLRRequest(id: string, sessionUser: any) {
  const before = await prisma.lRRequest.findUnique({ where: { id } });
  await prisma.lRRequest.delete({ where: { id } });

  await createLog({
    userId: sessionUser?.id ?? null,
    vendorId: sessionUser?.vendorId ?? null,
    action: "DELETE",
    model: "LRRequest",
    recordId: id,
    oldData: before,
    description: `Deleted LRRequest ${id}`,
  });

  return true;
}
