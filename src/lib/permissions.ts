
import { UserRoleEnum } from "@/utils/constant";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
    ...defaultStatements,
    posts: ["create", "read", "update", "delete", "delete:own", "update:own"],
} as const;

export const ac = createAccessControl(statement);


export const roles = {
    [UserRoleEnum.BOSS]: ac.newRole({
        ...adminAc.statements,

        
        posts: ["create", "read", "delete:own", "update:own"],
    }),
    [UserRoleEnum.ADMIN]: ac.newRole({
        // ...adminAc.statements,

        posts: ["create", "read", "update", "delete", "delete:own", "update:own"],
    }),
    [UserRoleEnum.VENDOR]: ac.newRole({
        posts: ["create", "read", "delete:own", "update:own"],
    }),

    [UserRoleEnum.TADMIN]: ac.newRole({
        // ...adminAc.statements,
        user: ["list", "ban", "update"],
        posts: ["create", "read", "update", "delete", "delete:own", "update:own"],
    }),
    [UserRoleEnum.TVENDOR]: ac.newRole({
        // ...adminAc.statements,
        posts: ["create", "read", "update", "delete", "delete:own", "update:own"],
    })
}

export const admin = ac.newRole({
    posts: ["create", "update"],
    ...adminAc.statements,
});



export const roleVisibility = {
    [UserRoleEnum.TADMIN]: [UserRoleEnum.TVENDOR],
    [UserRoleEnum.TVENDOR]: [], // TVENDOR can't see other roles
    [UserRoleEnum.ADMIN]: [UserRoleEnum.VENDOR],   // ADMIN can't see other roles
    [UserRoleEnum.VENDOR]: [],  // VENDOR can't see other roles
    [UserRoleEnum.BOSS]: [UserRoleEnum.ADMIN, UserRoleEnum.TADMIN, UserRoleEnum.TVENDOR, UserRoleEnum.VENDOR],
}

// Usage
 
// Example
// const tadminVisibleRoles = getVisibleRoles(UserRoleEnum.TADMIN);
// console.log(tadminVisibleRoles);
