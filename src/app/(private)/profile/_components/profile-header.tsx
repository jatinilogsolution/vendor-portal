"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Shield, Loader2 } from "lucide-react"
import { User } from "@/generated/prisma/client"
import { uploadUserImage } from "../_action/profile"
 
interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(user.image || "")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", user.id)

      const res = await uploadUserImage(formData)
      if (res.success) {
        setImageUrl(res.url!)
      } else {
        console.error(res.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <Avatar className="h-24 w-24">
            {isUploading ? (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <AvatarImage src={imageUrl || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </>
            )}
          </Avatar>
          {/* Edit Button overlay */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full shadow-md"
            onClick={() => fileInputRef.current?.click()}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-2">
            {user.emailVerified && (
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            )}
            <Badge variant="default">{user.role}</Badge>
            {user.banned && <Badge variant="destructive">Banned</Badge>}
          </div>
        </div>
      </div>
    </div>
  )
}
