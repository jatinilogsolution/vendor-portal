

"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,

    DialogContent,
    DialogDescription,

    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { PlusIcon } from "lucide-react"
import LorryTable from "../../lorries/_components/lorry-table"
import { useState } from "react"


export const AddLrButtonToInvoice = ({ refernceNo, vendorId, onClose }: { refernceNo: string, vendorId: string, onClose: () => void }) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false)
        onClose?.() // trigger parent refresh
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button variant={"outline"}><PlusIcon className=' w-5 h-5 text-primary' /> Add LR</Button>
                </DialogTrigger>
                <DialogContent className="min-w-7xl  "
                    onInteractOutside={(e) => e.preventDefault()}

                >
                    <DialogHeader>
                        <DialogTitle>Add More Transections</DialogTitle>
                        <DialogDescription>
                            Make changes to Invoice here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>


                    <LorryTable setOpen={handleClose} pod={true} refernceNo={refernceNo} vendorId={vendorId} height={20} />


                </DialogContent>
            </form>
        </Dialog>
    )
}
