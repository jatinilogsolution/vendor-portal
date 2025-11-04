import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Page() {
  return (

    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6  ">
        {/* <SectionCards /> */}
        {/* <div className="px-4 lg:px-6"> */}
        {/* <ChartAreaInteractive /> */}
        {/* </div> */}
        {/* <DataTable data={data} /> */}

        <h2 className="scroll-m-20 text-center border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Your dashboard will be ready shortly!
        </h2>
        <p className="  text-center leading-7 [&:not(:first-child)]:mt-6">

          Comming soon...        </p>

        {/* <div className=" flex items-center justify-center">
          <Spinner variant="bars" />

        </div> */}
      </div>
    </div>


  )
}
