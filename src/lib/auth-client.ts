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


export const { signOut, useSession, forgetPassword, sendVerificationEmail, resetPassword, admin, signUp } = authClient

// export const signIn = async () => {
//   try {


// console.log("hahaha clicked")
//     const data = await authClient.signIn.social({
//       provider: "google",
//     });

//     console.log("Login Sucess", data)
//   }
//   catch (er) {
//     console.log("Failed ot login", er)
//   }
// };