import { createAuthClient } from "better-auth/react"

import { adminClient, customSessionClient, inferAdditionalFields } from "better-auth/client/plugins"
import { ac, roles } from "@/lib/permissions"
import { auth } from "@/lib/auth"


const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL as string,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({ ac, roles }),
    customSessionClient<typeof auth>(),

  ],
})


export const { signOut, useSession, forgetPassword, sendVerificationEmail, resetPassword, admin, signUp, verifyEmail,  } = authClient
 