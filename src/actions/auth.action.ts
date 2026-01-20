"use server"

import { auth, ErrorCode } from "@/lib/auth"
import { headers } from "next/headers"
import { APIError } from "better-auth/api"
import { redirect } from "next/navigation"
import { LoginSchema, RegisterSchema, ChangePasswordPayload } from "@/validations/auth"
import { UserRoleEnum } from "@/utils/constant"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auditCreate, auditAuth } from "@/lib/audit-logger"




export const getCustomSession = async () => {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session) {

    redirect("/auth/login")
  }


  return session
}

// -------------------- SIGN IN --------------------
export async function signInEmailAction(data: LoginSchema) {
  const { email, password } = data

  if (!email) return { error: "Please enter your email" }
  if (!password) return { error: "Please enter your password" }

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: { email, password },
    })



    return { error: null }
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN"

      switch (errCode) {
        case "EMAIL_NOT_VERIFIED":
          redirect("/auth/verify?error=email_not_verified")
        default:
          return { error: err.message }
      }
    }

    return { error: "Internal Server Error" }
  }
}

// -------------------- SIGN UP --------------------
export async function signUpEmailAction(data: RegisterSchema) {
  const { name, email, password, role, vendorId } = data

  if (!name) return { error: "Please enter your name" }
  if (!email) return { error: "Please enter your email" }
  if (!password) return { error: "Please enter your password" }


  try {

    const newUser = await auth.api.createUser({
      body: {
        email: email,
        password: password,
        name: name,
        role: role as any,
        data: {
          vendorId: vendorId || null
        }
      },
    });

    // Log user registration
    await auditCreate(
      "User",
      { email, name, role, vendorId },
      `New user registered: ${name} (${email}) with role ${role}`,
      newUser.user.id
    );

    await auth.api.sendVerificationEmail({
      body: {
        email: newUser.user.email,
        callbackURL: "/auth/verify",
      }
    });
    revalidatePath("/admin");
    return { error: null }
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN"

      switch (errCode) {
        case "USER_ALREADY_EXISTS":
          return { error: "User already exists. Please log in instead." }
        default:
          return { error: err.message }
      }
    }

    return { error: "Internal Server Error" }
  }
}

// -------------------- CHANGE PASSWORD --------------------
export async function changePasswordAction(data: ChangePasswordPayload) {
  const { currentPassword, newPassword } = data

  if (!currentPassword) return { error: "Please enter your current password" }
  if (!newPassword) return { error: "Please enter your new password" }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword },
    })

    return { error: null }
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message }
    }
    return { error: "Internal Server Error" }
  }
}





export const getAllVendorForCreatingNewVendor = async () => {


  try {



    const vendorList = await prisma.vendor.findMany({
      select: {
        id: true,
        name: true
      }
    })

    return { data: vendorList }

  } catch (e) {
    console.log("Error in Getting Vendor for Creating new vendor: ", e);
    if (e instanceof Error) {
      return { error: e.message }
    }
    return { error: "Something went wrong" }
  }
}


