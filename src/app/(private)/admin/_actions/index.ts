// app/dashboard/users/actions/getUsers.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function getUsers(role: string, search?: string) {
  let allowedRoles: string[] = []

  switch (role) {
    case 'BOSS':
      allowedRoles = ['ADMIN', 'TADMIN', 'VENDOR', 'TVENDOR', 'BOSS']
      break
    case 'ADMIN':
      allowedRoles = ['ADMIN', 'VENDOR']
      break
    case 'TADMIN':
      allowedRoles = ['TADMIN', 'TVENDOR']
      break
    default:
      allowedRoles = [] // for vendor & tvendor
  }

  const where: any = {
    role: { in: allowedRoles },
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { Vendor: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  }

  const users = await prisma.user.findMany({
    where,
    include: { Vendor: true },
    orderBy: { createdAt: 'desc' },
  })

  return users
}
