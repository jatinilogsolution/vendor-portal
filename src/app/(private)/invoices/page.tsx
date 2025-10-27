




import { Spinner } from '@/components/ui/shadcn-io/spinner'
import React, { Suspense } from 'react'
import Index from './_component'

const page = () => {
  return (
    <Suspense fallback={<div className=" flex items-center justify-center h-dvh"><Spinner /></div>}>
      <Index />
    </Suspense>
  )
}

export default page