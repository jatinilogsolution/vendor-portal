import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { ChevronLeftIcon } from '@heroicons/react/16/solid'

import { getVendor } from '../_action/getVendor'
import Image from 'next/image'
import LorryTable from '../../lorries/_components/lorry-table'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ErrorCard } from '@/components/error'


export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params

  const { data, error } = await getVendor({ id });
  if (error) {
    return (

      <div className=' flex justify-center  h-72  items-center'>

        <ErrorCard
          title="Page Not Found"
          message={error ?? "Something went wrong fetching Profile."} />
      </div>

    )
  }

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Admin
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="w-32 shrink-0">
            <Image className="aspect-3/2 rounded-lg shadow-sm" src={data?.image || "/vercel.svg"} alt="Profile" width={100} height={100} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1>{data?.Vendor?.name}</h1>
              <Badge color={data?.role === 'TVENDOR' ? 'lime' : 'zinc'}>{data?.role}</Badge>
            </div>
            <span className="mt-2 text-sm text-zinc-400 space-y-1">
              {data?.Vendor?.Address?.map((address: any) => (
                <div key={address?.id}>
                  {address.line1 && <p>{address.line1}</p>}
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.state} - {address.postal}
                  </p>
                  <p>{address.country}</p>
                </div>
              )) || <h1>No address available</h1>}
            </span>

          </div>
        </div>
        <div className="flex gap-4">
          <Button variant={'link'}>
            <Link href={`/profile/${id}/edit`}>Edit</Link>

          </Button>
          {/* <Button>View</Button> */}
        </div>
      </div>

      <h2 className="mt-12 ">Pending LRs</h2>
      <Separator className=' my-2' />
      {data?.Vendor?.id}
      <LorryTable vendorId={data?.Vendor?.id || ""} />

    </>
  )
}
