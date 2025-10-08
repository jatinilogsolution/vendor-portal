"use server"

 import { prisma } from "@/lib/prisma";

export const getLRInfo = async (fileNumber: string) => {
     
    try {
        const LRData = await prisma.lRRequest.findMany({
            where: { fileNumber },
            include: {
                tvendor: {
                    include: {
                        users: {
                            select: {
                                email: true,
                                name: true,
                                phone: true,
                                image: true
                            }
                        }
                    }
                },
            }
        });

        if (!LRData || LRData.length === 0) {
            return { error: `No LR found for file number: ${fileNumber}` };
        }

        return { data: LRData };
    } catch (error) {
        console.error("Error fetching document ", error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return {
            error: "Something went wrong"
        };
    }
}

export type LRData = Awaited<ReturnType<typeof getLRInfo>>['data'];
