import { createAuthClient } from "better-auth/react"

import { adminClient, customSessionClient, emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins"
import { ac, roles } from "@/lib/permissions"
import { auth } from "@/lib/auth"


const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL as string,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({ ac, roles }),
    customSessionClient<typeof auth>(),
    emailOTPClient()

  ],
})

// import { inferAdditionalFields } from "better-auth/client/plugins";
// export const authClient = createAuthClient({
//   plugins: [inferAdditionalFields({
//       user: {
//         role: {
//           type: "string"
//         }
//       }
//   })],
// });

export const { signOut, useSession, sendVerificationEmail, resetPassword, admin, signUp, verifyEmail, requestPasswordReset } = authClient
