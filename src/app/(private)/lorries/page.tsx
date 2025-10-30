

import React from 'react'
import LorryTable from './_components/lorry-table'
import { getCustomSession } from '@/actions/auth.action'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { UserRoleEnum } from '@/utils/constant'
import { prisma } from '@/lib/prisma'

const page = async () => {

  const { session, user } = await getCustomSession()

  if (!session) {
    await signOut()
    redirect("/auth/login")
  }

  if (user.role === UserRoleEnum.TVENDOR) {
    const vendor = await prisma.user.findFirst({
      where: {
        AND: [{ id: user.id },
        { role: UserRoleEnum.TVENDOR }
        ]
      },
      include: {
        Vendor: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

    return (
      <div>

        <p className="leading-7  mb-2">Your All Pending LR without POD</p>
        <LorryTable vendorId={vendor?.Vendor?.id}  />
      </div>
    )
  }


  return (

    <div>
      {/* <h1>Lorry Recipet </h1> */}
      <h2 className=' mb-2'> All Pending LR without POD</h2>
      <LorryTable  />
    </div>

  )
}

export default page