// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetDescription,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet";
// import { Edit2Icon } from "lucide-react";
// import { FormEvent, useEffect, useState, useTransition } from "react";
// import { getInvoiceOnlyById } from "../_action/invoice-list";
// import { Invoice } from "@/generated/prisma";
// import { WarehouseSelector } from "@/components/modules/warehouse-selector";
// import { updateBillToAddress } from "../_action/invoice-update";
// import { Spinner } from "@/components/ui/shadcn-io/spinner";

// export const InvoiceAddOnSheet = ({ invoiceId }: { invoiceId: string }) => {
//     const [isPending, startTransition] = useTransition();
//     const [open, setOpen] = useState(false);
//     const [data, setData] = useState<Invoice | null>(null);
//     const [value, setValue] = useState<string>("");

//     useEffect(() => {
//         const fetchInvoice = async () => {
//             const { data, error } = await getInvoiceOnlyById({ id: invoiceId });
//             if (!error && data) {
//                 setData(data);
//                 setValue(data.billToId || ""); // initialize selector with existing value
//             }
//         };
//         fetchInvoice();
//     }, [invoiceId]);

//     const updateSheet = (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         console.log("form")
//         startTransition(async () => {
//             const res = await updateBillToAddress(invoiceId, value);
//             if (!("error" in res)) {
//                 setData(res); // update local state with new invoice data
//                 setOpen(false); // close sheet on success
//             } else {
//                 console.error(res.error);
//             }
//         });
//     };

//     return (
//         <Sheet open={open} onOpenChange={setOpen}>
//             <SheetTrigger asChild>
//                 <Button variant="secondary">
//                     <Edit2Icon className="text-blue-500 w-4 h-4 mr-1" /> Addon
//                 </Button>
//             </SheetTrigger>

//             {/* Wrap the entire SheetContent with the form */}
//             <SheetContent className="min-w-2xl">
//                 <form onSubmit={updateSheet}>

//                     <SheetHeader>
//                         <SheetTitle>Addon for Invoice: {data?.invoiceNumber || "..."}</SheetTitle>
//                         <SheetDescription>
//                             Make changes to the invoice here. Click save when you&apos;re done.
//                         </SheetDescription>
//                     </SheetHeader>

//                     <div className="grid flex-1 auto-rows-min gap-6 px-4">
//                         <div className="grid gap-3">
//                             <Label htmlFor="warehouse-selector">Warehouse</Label>
//                             <WarehouseSelector value={value} setValue={setValue} />
//                         </div>

//                         <div className="grid gap-3">
//                             <Label htmlFor="sheet-demo-username">Username</Label>
//                             <Input id="sheet-demo-username" defaultValue="@peduarte" />
//                         </div>
//                     </div>

//                     <SheetFooter className="flex justify-between">
//                         <Button disabled={isPending} type="submit">
//                             {isPending ? <Spinner className="w-5 h-5" /> : "Save changes"}
//                         </Button>

//                         {/* Make sure SheetClose button is separate and not inside the form */}
//                         <SheetClose asChild>
//                             <Button variant="outline" type="button">
//                                 Close
//                             </Button>
//                         </SheetClose>
//                     </SheetFooter>
//                 </form>

//             </SheetContent>
//         </Sheet>

//     );
// };



"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Edit2Icon } from "lucide-react"
import { type FormEvent, useEffect, useState, useTransition } from "react"
import { getInvoiceOnlyById } from "../_action/invoice-list"
import type { Invoice } from "@/generated/prisma"
import { WarehouseSelector } from "@/components/modules/warehouse-selector"
import { updateBillToAddress } from "../_action/invoice-update"
import { BillingAddition, BillingAdditions } from "./billing-additions"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
 
export const InvoiceAddOnSheet = ({ invoiceId }: { invoiceId: string }) => {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Invoice | null>(null)
  const [value, setValue] = useState<string>("")
  const [additions, setAdditions] = useState<BillingAddition[]>([])

  useEffect(() => {
    const fetchInvoice = async () => {
      const { data, error } = await getInvoiceOnlyById({ id: invoiceId })
      if (!error && data) {
        setData(data)
        setValue(data.billToId || "") // initialize selector with existing value
      }
    }
    fetchInvoice()
  }, [invoiceId])

  const updateSheet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("form")
    startTransition(async () => {
      const res = await updateBillToAddress(invoiceId, value)
      console.log("[v0] Billing additions to save:", additions)
      if (!("error" in res)) {
        setData(res) // update local state with new invoice data
        setOpen(false) // close sheet on success
      } else {
        console.error(res.error)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <Edit2Icon className="w-4 h-4 mr-1" /> Add more
        </Button>
      </SheetTrigger>

      {/* Wrap the entire SheetContent with the form */}
      <SheetContent className="min-w-2xl">
        <form onSubmit={updateSheet}>
          <SheetHeader>
            <SheetTitle>Addon for Invoice: {data?.invoiceNumber || "..."}</SheetTitle>
            <SheetDescription>Make changes to the invoice here. Click save when you&apos;re done.</SheetDescription>
          </SheetHeader>

          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label htmlFor="warehouse-selector">Warehouse</Label>
              <WarehouseSelector value={value} setValue={setValue} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="billing-additions">Billing Additions</Label>
              <BillingAdditions value={additions} onChange={setAdditions} />
            </div>
          </div>

          <SheetFooter className="flex justify-between">
            <Button disabled={isPending} type="submit">
              {isPending ? <Spinner className="w-5 h-5" /> : "Save changes"}
            </Button>

            {/* Make sure SheetClose button is separate and not inside the form */}
            <SheetClose asChild>
              <Button variant="outline" type="button">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
