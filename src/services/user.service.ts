import { prisma } from "@/lib/prisma";
import { UserRoleEnum } from "@/utils/constant";

/**
 * Find all users with a specific role
 */
export async function getUsersByRole(role: UserRoleEnum | string) {
    return prisma.user.findMany({
        where: {
            role: role
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    });
}
