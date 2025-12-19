import React from 'react'
import { getCustomSession } from '@/actions/auth.action'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { UserRoleEnum } from '@/utils/constant'
import { prisma } from '@/lib/prisma'
import AnnexureListContent from './_components/annexure-content'

export default async function AnnexurePage() {
  const { session, user } = await getCustomSession()

  if (!session) {
    await signOut()
    redirect("/auth/login")
  }

  // Only TVENDOR, TADMIN, and BOSS can access this page
  const allowedRoles = [UserRoleEnum.TVENDOR, UserRoleEnum.TADMIN, UserRoleEnum.BOSS]
  if (!allowedRoles.includes(user.role as UserRoleEnum)) {
    redirect("/dashboard")
  }

  // For TVENDOR, get their vendor ID for filtering
  let vendorId: string | undefined = undefined

  if (user.role === UserRoleEnum.TVENDOR) {
    const vendor = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        Vendor: {
          select: {
            id: true
          }
        }
      }
    })

    vendorId = vendor?.Vendor?.id
  }


  return <AnnexureListContent vendorId={vendorId} userRole={user.role!} />

}
