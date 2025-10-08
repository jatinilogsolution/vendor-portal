import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession } from "better-auth/plugins"

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2"
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { normalizeName } from "./utils";
import { ac, roles } from "@/lib/permissions"
import { UserRoleEnum } from "@/utils/constant";
import { sendEmailAction } from "@/actions/email/send-email.action";

const options = {
    database: prismaAdapter(prisma, {
        provider: "sqlserver",
    }),

    emailVerification: {
        sendOnSignUp: true,
        expiresIn: 60 * 60,
        autoSignInAfterVerification: false,
        sendVerificationEmail: async ({ user, url }) => {
            const link = new URL(url);
            link.searchParams.set("callbackURL", "/auth/verify");

            await sendEmailAction({
                to: user.email,
                subject: "Verify your email address",
                meta: {
                    description:
                        "Please verify your email address to complete the registration process.",
                    link: String(link),
                },
            });
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 6,
        password: {
            hash: hashPassword,
            verify: verifyPassword
        },
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmailAction({
                to: user.email,
                subject: "Reset your password",
                meta: {
                    description: "Please click the link below to reset your password.",
                    link: String(url),
                },
            });
        },
    },

    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                // const email = String(ctx.body.email);
                // const domain = email.split("@")[1].toLowerCase();

                // if (!VALID_DOMAINS().includes(domain)) {
                //     throw new APIError("BAD_REQUEST", {
                //         message: "Invalid domain. Please use a valid email.",
                //     });
                // }

                const name = normalizeName(ctx.body.name);

                const requestedRole = ctx.body.role?.toUpperCase();
                const validRoles = ["BOSS", "ADMIN", "VENDOR", "TVENDOR", "TADMIN"];

                // fallback to vendor if invalid/missing
                const role = validRoles.includes(requestedRole)
                    ? requestedRole
                    : UserRoleEnum.VENDOR;

                return {
                    context: {
                        ...ctx,
                        body: { ...ctx.body, name, role,  },
                    },
                };
            }


            if (ctx.path === "/update-user") {
                const name = normalizeName(ctx.body.name);

                return {
                    context: { ...ctx, body: { ...ctx.body, name } },
                };
            }
        }),
    },
    user: {
        additionalFields: {
            role: {
                // type: ["BOSS", "ADMIN", "VENDOR", "TVENDOR", "TADMIN"],
                // defaultValue: UserRoleEnum.VENDOR,
                type: "string",   // important
                required: false,
                // defaultValue: UserRoleEnum.VENDOR,

            },
            vendorId :{
            
                type:"string",
                required: false,

            }
        }
    },
    session: {
        expiresIn: 30 * 24 * 60 * 60,
    },
    advanced: {
        database: {
            generateId: false
        }
    },


    plugins: [nextCookies(), admin({
        adminRoles: [UserRoleEnum.ADMIN],
        defaultRole: UserRoleEnum.VENDOR,
        ac, roles
    })
    ]
} satisfies BetterAuthOptions;


export const auth = betterAuth(
    {
        ...options,
        plugins: [...(options.plugins || []),
        customSession(async ({ user, session }) => {
            return {
                session: {
                    expiresAt: session.expiresAt,
                    token: session.token,
                    userAgent: session.userAgent,
                },
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    createdAt: user.createdAt,
                    role: user.role,
                    vendorId: user.vendorId
                    
                },
            };
        }, options),
        ]
    }
);

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";