import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { normalizeName } from "./utils";
import { ac, roles } from "@/lib/permissions";
import { UserRoleEnum } from "@/utils/constant";
import { sendAuthEmail } from "@/services/mail";
import { genericOAuth } from "better-auth/plugins";

const options = {
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
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

      await sendAuthEmail({
        to: user.email,
        subject: "Verify your email address",
        meta: {
          description:
            "Please verify your email address to complete the registration process.",
          link: String(link),
          user: user.name,
          buttonTitle: "Verify Mail",
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
      verify: verifyPassword,
    },
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "Reset your password",
        meta: {
          description: "Please click the button below to reset your password.",
          link: String(url),
          user: user.name,
          buttonTitle: "Reset Password",
        },
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
            body: { ...ctx.body, name, role },
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
        type: "string", // important
        required: true,
        // input: true
        // defaultValue: UserRoleEnum.VENDOR,
      },
      vendorId: {
        type: "string",
        required: false,
      },
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["authentik"],
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },

  plugins: [
    nextCookies(),
    admin({
      adminRoles: [UserRoleEnum.BOSS, UserRoleEnum.ADMIN, UserRoleEnum.TADMIN],
      defaultRole: UserRoleEnum.VENDOR,
      ac,
      roles,
    }),
    genericOAuth({
      config: [
        {
          providerId: "authentik",
          discoveryUrl: process.env.AUTHENTIK_DISCOVERY_URL!,
          clientId: process.env.AUTHENTIK_CLIENT_ID!,
          clientSecret: process.env.AUTHENTIK_CLIENT_SECRET!,
          scopes: ["openid", "profile", "email"],
          disableSignUp: true,
        },
      ],
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,

  plugins: [
    ...(options.plugins || []),
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
          vendorId: user.vendorId,
        },
      };
    }, options),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
