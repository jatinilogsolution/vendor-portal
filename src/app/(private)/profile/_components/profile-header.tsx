"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Shield } from "lucide-react"
import { User } from "@/generated/prisma"


interface ProfileHeaderProps {
  user: User
  isEditing: boolean
  onEditToggle: () => void
}

export function ProfileHeader({ user, isEditing, onEditToggle }: ProfileHeaderProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-2">
            {user.emailVerified && (
              <Badge variant="outline" className="gap-1">
                <Shield />
                Verified
              </Badge>
            )}
            <Badge variant="default">{user.role}</Badge>
            {user.banned && <Badge variant="destructive">Banned</Badge>}
          </div>
        </div>
      </div>
      <Button onClick={onEditToggle} variant={isEditing ? "outline" : "default"} className="gap-2">
        <Edit2 className="h-4 w-4" />
        {isEditing ? "Cancel" : "Edit Profile"}
      </Button>
    </div>
  )
}
