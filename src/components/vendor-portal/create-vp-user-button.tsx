// src/components/vendor-portal/create-vp-user-button.tsx
"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { IconUserPlus } from "@tabler/icons-react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useSession } from "@/lib/auth-client"

import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Command, CommandEmpty, CommandGroup,
    CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { createVpUser, getVpVendorsForSelect } from "@/actions/vp/user.action"
import { UserRoleEnum } from "@/utils/constant"
import { getAllVendorForCreatingNewVendor, signUpEmailAction } from "@/actions/auth.action"

// ── Form schema ────────────────────────────────────────────────
const schema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Minimum 8 characters"),
    role: z.enum(["ADMIN", "BOSS", "VENDOR"]),
    vendorId: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

type VendorOption = { id: string; name: string; vendorType: string }

// ── Roles each actor can assign ────────────────────────────────
const ASSIGNABLE_ROLES: Record<string, Array<"ADMIN" | "BOSS" | "VENDOR">> = {
    BOSS: ["ADMIN", "BOSS", "VENDOR"],
    ADMIN: ["VENDOR"],
}
interface CreateVpUserButtonProps {
    onSuccess?: () => void
}
export function CreateVpUserButton({ onSuccess }: CreateVpUserButtonProps = {}) {
    const { data: session } = useSession()
    const actorRole = session?.user?.role ?? ""

    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [vendors, setVendors] = useState<VendorOption[]>([])
    const [vendorSearch, setVendorSearch] = useState("")
    const [comboOpen, setComboOpen] = useState(false)
    const listRef = useRef<HTMLDivElement | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "", role: "VENDOR", vendorId: "" },
    })

    const selectedRole = form.watch("role")
    const selectedVendorId = form.watch("vendorId")

    // Fetch VP vendors once on open
    // useEffect(() => {
    //     if (!open) return
    //     getVpVendorsForSelect().then((res) => {
    //         if (res.success) setVendors(res.data)
    //         else toast.error("Could not load vendors")
    //     })
    // }, [open])
      useEffect(() => {
        const fetchVendors = async () => {
           if (!open) return;
         
          const { data, error } = await getAllVendorForCreatingNewVendor()
          if (error) {
            console.error("Error fetching vendors:", error)
            toast.error("Error in fetching vendors")
            return
          }
          setVendors(data as any)
        }
        fetchVendors()
      }, [open])
    

    const filteredVendors = useMemo(() => {
        if (!vendorSearch) return vendors
        const q = vendorSearch.toLowerCase()
        return vendors.filter((v) => v.name.toLowerCase().includes(q))
    }, [vendors, vendorSearch])

    // Virtual list for large vendor lists
    const virtualizer = useVirtualizer({
        count: filteredVendors.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => 36,
        overscan: 8,
    })

    const assignable = ASSIGNABLE_ROLES[actorRole] ?? []
    if (!assignable.length) return null   // hide for VENDOR role

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            const result = await signUpEmailAction(values)
            if (result.error) { toast.error(result.error); return }
            toast.success("User created successfully")
            form.reset()
            setOpen(false)
            onSuccess?.()   // ← call parent refresh
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <IconUserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Vendor Portal User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the vendor portal.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Name */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Email */}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="vendor@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Password */}
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Min. 8 characters" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Role */}
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {assignable.map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Vendor picker — only when role = VENDOR */}
                        {selectedRole === "VENDOR" && (
                            <FormField control={form.control} name="vendorId" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Assign to Vendor</FormLabel>
                                    <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value
                                                        ? vendors.find((v) => v.id === field.value)?.name
                                                        : "Select vendor"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Search vendor..."
                                                    value={vendorSearch}
                                                    onValueChange={setVendorSearch}
                                                />
                                                <CommandList>
                                                    {filteredVendors.length === 0
                                                        ? <CommandEmpty>No vendor found.</CommandEmpty>
                                                        : (
                                                            <CommandGroup className="p-0">
                                                                <div ref={listRef} className="max-h-60 overflow-auto">
                                                                    <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                                                                        {virtualizer.getVirtualItems().map((row) => {
                                                                            const v = filteredVendors[row.index]
                                                                            return (
                                                                                <div
                                                                                    key={v.id}
                                                                                    ref={virtualizer.measureElement}
                                                                                    data-index={row.index}
                                                                                    style={{
                                                                                        position: "absolute", top: 0, left: 0,
                                                                                        width: "100%", transform: `translateY(${row.start}px)`,
                                                                                    }}
                                                                                >
                                                                                    <CommandItem
                                                                                        value={v.name}
                                                                                        onSelect={() => {
                                                                                            form.setValue("vendorId", v.id)
                                                                                            setComboOpen(false)
                                                                                        }}
                                                                                    >
                                                                                        <Check className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            selectedVendorId === v.id ? "opacity-100" : "opacity-0",
                                                                                        )} />
                                                                                        <span className="flex-1">{v.name}</span>
                                                                                        <Badge variant="outline" className="ml-2 text-xs">
                                                                                            {v.vendorType}
                                                                                        </Badge>
                                                                                    </CommandItem>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </CommandGroup>
                                                        )
                                                    }
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}