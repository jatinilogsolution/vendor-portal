import { UserRoleEnum } from "@/utils/constant"

const bossManageableRoles = [UserRoleEnum.BOSS, UserRoleEnum.ADMIN, UserRoleEnum.VENDOR]
const adminManageableRoles = [UserRoleEnum.ADMIN, UserRoleEnum.VENDOR]

export function canManageUserBan(
    actorRole?: string | null,
    actorUserId?: string | null,
    targetRole?: string | null,
    targetUserId?: string | null,
) {
    if (!actorRole || !targetRole) return false
    if (actorUserId && targetUserId && actorUserId === targetUserId) return false

    if (actorRole === UserRoleEnum.BOSS) {
        return bossManageableRoles.includes(targetRole as (typeof bossManageableRoles)[number])
    }

    if (actorRole === UserRoleEnum.ADMIN) {
        return adminManageableRoles.includes(targetRole as (typeof adminManageableRoles)[number])
    }

    return false
}

export function getUserBanPermissionError(actorRole?: string | null, targetRole?: string | null) {
    if (targetRole === UserRoleEnum.BOSS && actorRole !== UserRoleEnum.BOSS) {
        return "A boss can only be banned by another boss"
    }

    if (actorRole === UserRoleEnum.ADMIN) {
        return "Admins can only ban admins and vendors"
    }

    return "You do not have permission to ban this user"
}
