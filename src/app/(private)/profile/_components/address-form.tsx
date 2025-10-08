"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CardContent, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getAddressByVendorId, updateAddressByVendorId } from "../_action/getVendor"
import { toast } from "sonner"

// ✅ Address Schema
const addressSchema = z.object({
    line1: z.string().min(1, "Line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    postal: z.string().optional(),
    country: z.string().min(1, "Country is required"),
})

type AddressFormValues = z.infer<typeof addressSchema>

export function VendorAddressCard({
    vendorId
}: {
    vendorId: string

}) {
    const [open, setOpen] = useState(false)

    const [address, setAddress] = useState<AddressFormValues | undefined>(undefined);
    useEffect(() => {
        const fetchAddress = async () => {


            const { data, error } = await getAddressByVendorId(vendorId)
            if (error) {
                toast.error("Error in getting Address")
            }
            setAddress(data as any)
        }
        fetchAddress()
    }, [vendorId])


    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {},
    })

    const handleEdit = async (data: AddressFormValues) => {

        try {

            await updateAddressByVendorId({
                data: {
                    city: data.city,
                    country: data.country,
                    line1: data.line1,
                    line2: data.line2,
                    postal: data.postal,
                    state: data.state
                },
                id: vendorId
            })

            toast.success("Address updated sucessfully")
            reset()
        } catch (e) {
            console.log("Error while saving: ", e)
            toast.error("Failed to update address")
        }
        setOpen(false)
    }

    return (
        <div className="w-full max-w-lg shadow-md">

            <CardTitle className="text-lg">Vendor Address</CardTitle>
            {/* <CardDescription>Current saved address details</CardDescription> */}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
                        <div>
                            <Label>Line 1</Label>
                            <Input {...register("line1")} />
                            {errors.line1 && <p className="text-sm text-red-500">{errors.line1.message}</p>}
                        </div>
                        <div>
                            <Label>Line 2</Label>
                            <Input {...register("line2")} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>City</Label>
                                <Input {...register("city")} />
                                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                            </div>
                            <div>
                                <Label>State</Label>
                                <Input {...register("state")} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Postal Code</Label>
                                <Input {...register("postal")} />
                            </div>
                            <div>
                                <Label>Country</Label>
                                <Input {...register("country")} />
                                {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


            <CardContent className="space-y-2 text-sm">
                <p>  {address?.line1}</p>
                {address?.line2}
                {address?.city}
                {address?.state}
                {address?.postal}
                {address?.country}
            </CardContent>
        </div>
    )
}
