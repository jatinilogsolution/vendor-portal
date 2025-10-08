"use server"
// Utility to check permissions for a user
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { statement } from "./permissions";

type PermissionType = keyof typeof statement;
type PermissionAction = (typeof statement)[PermissionType][number];

interface PermissionCheck {
    resource: PermissionType;
    actions: PermissionAction[];
}

interface PermissionResult {
    resource: PermissionType;
    actions: Record<PermissionAction, boolean>;
}

/**
 * Checks multiple permissions for the current user session.
 * @param permissions Array of permission checks to perform.
 * @returns Array of permission results indicating which actions are allowed.
 */
export async function checkUserPermissions(
    permissions: PermissionCheck[]
): Promise<PermissionResult[]> {
  
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        throw new Error("No active session found");
    }

    const results = await Promise.all(
        permissions.map(async ({ resource, actions }) => {
            const response = await auth.api.userHasPermission({
                body: {
                    userId: session.user.id,
                    permissions: { [resource]: actions },
                },
            });

            const result: PermissionResult = {
                resource,
                actions: actions.reduce(
                    (acc, action) => ({
                        ...acc,
                        [action]: response.success,
                    }),
                    {} as Record<PermissionAction, boolean>
                ),
            };

            return result;
        })
    );

    return results;
}

/**
 * Utility to get permission check results as a map for easier access.
 * @param permissions Array of permission checks to perform.
 * @returns Map of resource to action permissions.
 */
export async function getPermissionMap(
    permissions: PermissionCheck[]
): Promise<Record<PermissionType, Record<PermissionAction, boolean>>> {
    const results = await checkUserPermissions(permissions);
    return results.reduce(
        (acc, { resource, actions }) => ({
            ...acc,
            [resource]: actions,
        }),
        {} as Record<PermissionType, Record<PermissionAction, boolean>>
    );
}