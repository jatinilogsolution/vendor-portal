"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Check, ChevronsUpDown } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { getAllVendorForCreatingNewVendor, signUpEmailAction } from "@/actions/auth.action"
import { registerSchema, RegisterSchema } from "@/validations/auth"
import { UserRole, UserRoleEnum } from "@/utils/constant"
import { useSession } from "@/lib/auth-client"
import { IconUserPlus } from "@tabler/icons-react"
import { useVirtualizer } from "@tanstack/react-virtual"

export const CreateNewUserButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [vendors, setVendors] = useState<{ name: string; id: string }[]>([])
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [vendorSearch, setVendorSearch] = useState("")
  const vendorListRef = useRef<HTMLDivElement | null>(null)
  const { data } = useSession()
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "VENDOR",
      vendorId: "",
    },
  })

  // fetch vendors on mount
  useEffect(() => {
    const fetchVendors = async () => {
      const { data, error } = await getAllVendorForCreatingNewVendor()
      if (error) {
        console.error("Error fetching vendors:", error)
        toast.error("Error in fetching vendors")
        return
      }
      setVendors(data as any)
    }
    fetchVendors()
  }, [])

  const selectedRole = form.watch("role")
  const selectedVendorId = form.watch("vendorId")

  const filteredVendors = useMemo(() => {
    if (!vendorSearch) return vendors
    const term = vendorSearch.toLowerCase()
    return vendors.filter((vendor) => vendor.name.toLowerCase().includes(term))
  }, [vendors, vendorSearch])

  const vendorVirtualizer = useVirtualizer({
    count: filteredVendors.length,
    getScrollElement: () => vendorListRef.current,
    estimateSize: () => 36,
    overscan: 8,
  })

  const onSubmit = (values: RegisterSchema) => {
    startTransition(async () => {
      try {
        const { error } = await signUpEmailAction(values)
        if (error) {
          toast.error(error)
        } else {
          
          toast.success("User registered successfully! Please verify the email.")
          form.reset()
          setIsOpen(false)
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto px-6 py-2 text-sm font-medium transition-colors duration-200"><IconUserPlus />Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className=" w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.user.role === UserRoleEnum.ADMIN && (
                        <SelectItem value={UserRoleEnum.VENDOR}>VENDOR</SelectItem>
                      )}

                      {data?.user.role === UserRoleEnum.TADMIN && (
                        <SelectItem value={UserRoleEnum.TVENDOR}>TVENDOR</SelectItem>
                      )}

                      {(data?.user.role === UserRoleEnum.BOSS) && (
                        <>
                          {UserRole.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(selectedRole === "VENDOR" || selectedRole === "TVENDOR") && (
              <FormField
                control={form.control}
                name="vendorId"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Assigned to</FormLabel>
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                      <PopoverTrigger asChild className="w-full">
                        <FormControl className="w-full">
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={comboboxOpen}
                            className={cn(
                              "w-full  justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? vendors.find((v) => v.id === field.value)?.name
                              : "Select vendor"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      {/* Make content full width & match trigger width */}
                      <PopoverContent
                        className="w-(--radix-popover-trigger-width) p-0"
                        align="start"
                      >
                        <Command className="w-full" shouldFilter={false}>
                          <CommandInput
                            placeholder="Search vendor..."
                            value={vendorSearch}
                            onValueChange={setVendorSearch}
                          />
                          <CommandList>
                            {filteredVendors.length === 0 ? (
                              <CommandEmpty>No vendor found.</CommandEmpty>
                            ) : (
                              <CommandGroup className="p-0">
                                <div
                                  ref={vendorListRef}
                                  className="max-h-75 overflow-auto"
                                >
                                  <div
                                    style={{
                                      height: `${vendorVirtualizer.getTotalSize()}px`,
                                      position: "relative",
                                    }}
                                  >
                                    {vendorVirtualizer
                                      .getVirtualItems()
                                      .map((virtualRow) => {
                                        const vendor = filteredVendors[virtualRow.index]
                                        return (
                                          <div
                                            key={vendor.id}
                                            ref={vendorVirtualizer.measureElement}
                                            data-index={virtualRow.index}
                                            style={{
                                              position: "absolute",
                                              top: 0,
                                              left: 0,
                                              width: "100%",
                                              transform: `translateY(${virtualRow.start}px)`,
                                            }}
                                          >
                                            <CommandItem
                                              value={vendor.name}
                                              onSelect={() => {
                                                form.setValue("vendorId", vendor.id)
                                                setComboboxOpen(false)
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  selectedVendorId === vendor.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              {vendor.name}
                                            </CommandItem>
                                          </div>
                                        )
                                      })}
                                  </div>
                                </div>
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="gap-2 ">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
