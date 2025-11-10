

import React from 'react'
import LorryTable from './_components/lorry-table'
import { getCustomSession } from '@/actions/auth.action'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { UserRoleEnum } from '@/utils/constant'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { IconUpload } from '@tabler/icons-react'

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


        <div className=' flex items-center justify-between mb-2'>

          <h2 className=' mb-2 font-medium text-md'> All Pending LR without POD</h2>
          <Button variant={"secondary"} asChild>
            <Link href={"/lorries/annexure"} ><IconUpload className="text-primary" /> Annexure</Link>
          </Button>
        </div>
        <LorryTable vendorId={vendor?.Vendor?.id} />
      </div>
    )
  }


  return (

    <div>
      {/* <h1>Lorry Recipet </h1> */}
      <div className=' flex items-center justify-between mb-2'>

        <h2 className=' mb-2 font-medium text-md'> All Pending LR without POD</h2>
        <Button variant={"secondary"} asChild>
          <Link href={"/lorries/annexure"} ><IconUpload className="text-primary" /> Annexure</Link>
        </Button>
      </div>

      <LorryTable />
    </div>

  )
}

export default page