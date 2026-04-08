"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { changePasswordAction } from "@/actions/auth.action"
import { requestPasswordReset } from "@/lib/auth-client"

interface PasswordManagementCardProps {
  email: string
}

export function PasswordManagementCard({ email }: PasswordManagementCardProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false)
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChangePassword = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill in all password fields.")
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match.")
      return
    }

    setIsChangingPassword(true)

    try {
      const result = await changePasswordAction({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Password changed successfully.")
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSendResetEmail = async () => {
    setIsSendingResetEmail(true)

    await requestPasswordReset({
      email,
      redirectTo: "/auth/reset-password",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Password reset email sent.")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Unable to send reset email.")
        },
        onResponse: () => {
          setIsSendingResetEmail(false)
        },
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password & Security</CardTitle>
        <CardDescription>
          Change your password using your current password or send yourself a reset email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid gap-4 grid-row-3 ">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={form.newPassword}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, newPassword: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                }
              />
            </div>
          </div>
          <Button type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </form>

        {/* <div className="rounded-lg border bg-muted/30 p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Reset by Email</p>
            <p className="text-sm text-muted-foreground">
              Send a secure reset link to <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>
          <Button
            className="mt-4"
            variant="outline"
            onClick={handleSendResetEmail}
            disabled={isSendingResetEmail}
          >
            {isSendingResetEmail ? "Sending..." : "Send Reset Email"}
          </Button>
        </div> */}
      </CardContent>
    </Card>
  )
}
