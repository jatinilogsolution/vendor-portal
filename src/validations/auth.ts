import { UserRole } from "@/utils/constant"
import { z } from "zod"
export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),

})

export type LoginSchema = z.infer<typeof loginSchema>




// ✅ Zod schema
export const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(UserRole),
  vendorId: z.string().optional()
})

export type RegisterSchema = z.infer<typeof registerSchema>


export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}


