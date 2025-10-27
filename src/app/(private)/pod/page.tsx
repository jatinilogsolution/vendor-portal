import { Suspense } from "react"
import Index from "./_components"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

export default async function Page() {
  return (
    <Suspense fallback={<div className=" flex items-center justify-center h-dvh"><Spinner /></div>}>
      <Index />
    </Suspense>
  )
}
