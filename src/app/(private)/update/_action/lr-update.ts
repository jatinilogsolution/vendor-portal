"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const LRUpdateSchema = z.object({
  id: z.string(),
  vehicleType: z.string().optional().nullable(),
  vehicleNo: z.string().optional().nullable(),
  CustomerName: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  destination: z.string().optional().nullable(),

  priceOffered: z.coerce.number().optional().nullable(),
  lrPrice: z.coerce.number().optional().nullable(),
  modifiedPrice: z.coerce.number().optional().nullable(),
  priceSettled: z.coerce.number().optional().nullable(),
  extraCost: z.coerce.number().optional().nullable(),

  remark: z.string().optional().nullable(),

  tvendorId: z.string(),
  invoiceId: z.string().optional().nullable(),
  annexureId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
});

export async function updateLR(prevState: any, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries());
    const data = LRUpdateSchema.parse(raw);

    await prisma.lRRequest.update({
      where: { id: data.id },
      data: {
        vehicleType: data.vehicleType || null,
        vehicleNo: data.vehicleNo || null,
        CustomerName: data.CustomerName || null,
        origin: data.origin || null,
        destination: data.destination || null,

        priceOffered: data.priceOffered,
        lrPrice: data.lrPrice,
        modifiedPrice: data.modifiedPrice,
        priceSettled: data.priceSettled,
        extraCost: data.extraCost,
        remark: data.remark,

        tvendorId: data.tvendorId,
        invoiceId: data.invoiceId || null,
        annexureId: data.annexureId || null,
        groupId: data.groupId || null,
      },
    });

    revalidatePath("/lrs");
    return { success: true };
  } catch (error: any) {
    console.log("LR Update Error", error);
    return { error: error.message };
  }
}
