
// "use client"
// import * as React from "react"
// import { Check, ChevronsUpDown, MapPin, FileText, Building2, Loader2 } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command"
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"

// interface Warehouse {
//     id: number
//     warehouseId: string
//     customerAccount: string
//     warehouseMainId: string
//     warehouseName: string
//     addressLine1: string | null
//     addressLine2: string | null
//     city: string | null
//     state: string | null
//     pinCode: string | null
//     country: string | null
//     locationId: string | null
//     fromDate: Date | null
//     toDate: Date | null
//     stateCode: string | null
//     isActive: string
//     gstinNumber: string | null
//     gstinAddress: string | null
//     totalArea: number | null
//     budgetArea2425: number | null
//     gstinNumberAlt: string | null
//     ilogGstin: string | null
//     latitude: number | null
//     longitude: number | null
// }

// export function WarehouseSelector({ value, setValue }: { value: string, setValue: (value: string) => void }) {
//     const [open, setOpen] = React.useState(false)
//     // const [value, setValue] = React.useState<string>("")
//     const [warehouses, setWarehouses] = React.useState<Warehouse[]>([])
//     const [loading, setLoading] = React.useState<boolean>(true)

//     React.useEffect(() => {
//         const fetchWarehouses = async () => {
//             try {
//                 const cached = localStorage.getItem("warehousesCache");
//                 const cacheTime = localStorage.getItem("warehousesCacheTime");
//                 const now = new Date().getTime();

//                 if (cached && cacheTime && now - parseInt(cacheTime) < 10 * 60 * 1000) {
//                     // Use cache if less than 10 minutes old
//                     setWarehouses(JSON.parse(cached));
//                     setLoading(false);
//                     return;
//                 }

//                 // Fetch from API
//                 const res = await fetch("/api/addresses/warehouse");
//                 if (!res.ok) throw new Error("Failed to fetch warehouses");
//                 const data = await res.json();

//                 setWarehouses(data);
//                 localStorage.setItem("warehousesCache", JSON.stringify(data));
//                 localStorage.setItem("warehousesCacheTime", now.toString());
//             } catch (e) {
//                 console.error("Error fetching warehouses:", e);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchWarehouses();
//     }, []);


//     const selectedWarehouse = warehouses.find((w) => w.id.toString() === value)

//     const formatAddress = (warehouse: Warehouse) => {
//         const parts = [
//             warehouse.addressLine1,
//             warehouse.addressLine2,
//             warehouse.city,
//             warehouse.state,
//             warehouse.pinCode,
//         ].filter(Boolean)
//         return parts.join(", ")
//     }

//     return (
//         <div className="w-full relative ">
//             <Popover modal open={open} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                     <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={open}
//                         className="w-full justify-between h-auto min-h-[30px] px-4 py-3 hover:bg-accent/50 transition-colors"
//                     >
//                         <Building2 className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />

//                         <div className="flex-1  min-w-0">
//                             {selectedWarehouse ? (
//                                 <div className="space-y-1">
//                                     <div className="font-medium  text-start text-foreground">
//                                         {selectedWarehouse.warehouseName}
//                                     </div>
//                                     <div className="text-sm text-start text-muted-foreground truncate">
//                                         {formatAddress(selectedWarehouse) || "No address available"}
//                                     </div>
//                                 </div>
//                             ) : loading ? (
//                                 <div className="flex items-center gap-2 text-muted-foreground">
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                     <span>Loading warehouses...</span>
//                                 </div>
//                             ) : (
//                                 <span className="text-muted-foreground">Select a warehouse...</span>
//                             )}
//                         </div>

//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-full p-0 shadow-lg"
//                     align="start">
//                     <Command>
//                         <CommandInput
//                             placeholder="Search by name, city, or GSTIN..."
//                             className="h-12 border-b"
//                         />
//                         <CommandList className="max-h-[400px]">
//                             <CommandEmpty className="py-8 text-center text-muted-foreground">
//                                 <Building2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
//                                 <p className="text-sm">No warehouse found</p>
//                             </CommandEmpty>
//                             <CommandGroup>
//                                 {warehouses.map((warehouse) => {
//                                     const isSelected = value === warehouse.id.toString()
//                                     const fullAddress = formatAddress(warehouse)

//                                     return (
//                                         <CommandItem
//                                             key={warehouse.id}
//                                             value={`${warehouse.warehouseName} ${warehouse.city} ${warehouse.state} ${warehouse.gstinNumber}`}
//                                             onSelect={() => {
//                                                 setValue(isSelected ? "" : warehouse.id.toString())
//                                                 setOpen(false)
//                                             }}
//                                             className={cn(
//                                                 "px-4 py-3 cursor-pointer transition-colors",
//                                                 "hover:bg-accent/50",
//                                                 isSelected && "bg-accent"
//                                             )}
//                                         >
//                                             <div className="flex items-start gap-3 flex-1">
//                                                 <div className={cn(
//                                                     "mt-1 p-1.5 rounded-md shrink-0",
//                                                     isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
//                                                 )}>
//                                                     <Building2 className="h-4 w-4" />
//                                                 </div>

//                                                 <div className="flex-1 min-w-0 space-y-2">
//                                                     {/* Warehouse Name */}
//                                                     <div className="font-medium text-foreground">
//                                                         {warehouse.warehouseName}
//                                                     </div>

//                                                     {/* Address */}
//                                                     {fullAddress && (
//                                                         <div className="flex items-start gap-2 text-sm text-muted-foreground">
//                                                             <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
//                                                             <span className="line-clamp-2 text-wrap truncate max-w-lg">{fullAddress}</span>
//                                                         </div>
//                                                     )}

//                                                     {/* GSTIN */}
//                                                     {warehouse.gstinNumber && (
//                                                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                                             <FileText className="h-3.5 w-3.5 shrink-0" />
//                                                             <span className="font-mono text-xs">
//                                                                 GSTIN: {warehouse.gstinNumber}
//                                                             </span>
//                                                         </div>
//                                                     )}

//                                                     {/* Total Area */}
//                                                     {/* {warehouse.totalArea && (
//                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                               <Ruler className="h-3.5 w-3.5 shrink-0" />
//                               <span className="text-xs">
//                                 Area: {warehouse.totalArea.toLocaleString()} sq ft
//                               </span>
//                             </div>
//                           )}
//                            */}
//                                                     {/* Status Badge */}
//                                                     {warehouse.isActive && (
//                                                         <div className="flex items-center gap-2">
//                                                             <span className={cn(
//                                                                 "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
//                                                                 warehouse.isActive.toLowerCase() === "active" || warehouse.isActive === "1"
//                                                                     ? "bg-primary/10 text-primary"
//                                                                     : "bg-muted text-muted-foreground"
//                                                             )}>
//                                                                 {warehouse.isActive.toLowerCase() === "active" || warehouse.isActive === "1" ? "Active" : "Inactive"}
//                                                             </span>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 <Check
//                                                     className={cn(
//                                                         "h-4 w-4 shrink-0 mt-1",
//                                                         isSelected ? "opacity-100 text-primary" : "opacity-0"
//                                                     )}
//                                                 />
//                                             </div>
//                                         </CommandItem>
//                                     )
//                                 })}
//                             </CommandGroup>
//                         </CommandList>
//                     </Command>
//                 </PopoverContent>
//             </Popover>
//         </div>
//     )
// }
"use client"
import * as React from "react"
import { Check, ChevronsUpDown, MapPin, FileText, Building2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Warehouse {
  id: number
  warehouseId: string
  customerAccount: string
  warehouseMainId: string
  warehouseName: string
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  pinCode: string | null
  country: string | null
  locationId: string | null
  fromDate: Date | null
  toDate: Date | null
  stateCode: string | null
  isActive: string
  gstinNumber: string | null
  gstinAddress: string | null
  totalArea: number | null
  budgetArea2425: number | null
  gstinNumberAlt: string | null
  ilogGstin: string | null
  latitude: number | null
  longitude: number | null
}

export function WarehouseSelector({ value, setValue }: { value: string; setValue: (value: string) => void }) {
  const [open, setOpen] = React.useState(false)
  // const [value, setValue] = React.useState<string>("")
  const [warehouses, setWarehouses] = React.useState<Warehouse[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const cached = localStorage.getItem("warehousesCache")
        const cacheTime = localStorage.getItem("warehousesCacheTime")
        const now = new Date().getTime()

        if (cached && cacheTime && now - Number.parseInt(cacheTime) < 10 * 60 * 1000) {
          // Use cache if less than 10 minutes old
          setWarehouses(JSON.parse(cached))
          setLoading(false)
          return
        }

        // Fetch from API
        const res = await fetch("/api/addresses/warehouse")
        if (!res.ok) throw new Error("Failed to fetch warehouses")
        const data = await res.json()

        setWarehouses(data)
        localStorage.setItem("warehousesCache", JSON.stringify(data))
        localStorage.setItem("warehousesCacheTime", now.toString())
      } catch (e) {
        console.error("Error fetching warehouses:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchWarehouses()
  }, [])

  const selectedWarehouse = warehouses.find((w) => w.id.toString() === value)

  const formatAddress = (warehouse: Warehouse) => {
    const parts = [
      warehouse.addressLine1,
      warehouse.addressLine2,
      warehouse.city,
      warehouse.state,
      warehouse.pinCode,
    ].filter(Boolean)
    return parts.join(", ")
  }

  return (
    <div className="w-full relative ">
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[30px] px-4 py-3 hover:bg-accent/50 transition-colors bg-transparent"
          >
            <Building2 className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />

            <div className="flex-1  min-w-0">
              {selectedWarehouse ? (
                <div className="space-y-1">
                  <div className="font-medium  text-start text-foreground">{selectedWarehouse.warehouseName}</div>
                  <div className="text-sm text-start text-muted-foreground truncate">
                    {formatAddress(selectedWarehouse) || "No address available"}
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading warehouses...</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Select a warehouse...</span>
              )}
            </div>

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 shadow-lg" align="start">
          <Command>
            <CommandInput placeholder="Search by name, city, or GSTIN..." className="h-12 border-b" />
            <CommandList className="max-h-[400px]">
              <CommandEmpty className="py-8 text-center text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No warehouse found</p>
              </CommandEmpty>
              <CommandGroup>
                {warehouses.map((warehouse) => {
                  const isSelected = value === warehouse.id.toString()
                  const fullAddress = formatAddress(warehouse)

                  return (
                    <CommandItem
                      key={warehouse.id}
                      value={`${warehouse.warehouseName} ${warehouse.city} ${warehouse.state} ${warehouse.gstinNumber}`}
                      onSelect={() => {
                        setValue(isSelected ? "" : warehouse.id.toString())
                        setOpen(false)
                      }}
                      className={cn(
                        "px-4 py-3 cursor-pointer transition-colors",
                        "hover:bg-accent/50",
                        isSelected && "bg-accent",
                      )}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={cn(
                            "mt-1 p-1.5 rounded-md shrink-0",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <Building2 className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Warehouse Name */}
                          <div className="font-medium text-foreground">{warehouse.warehouseName}</div>

                          {/* Address */}
                          {fullAddress && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                              <span className="line-clamp-2 text-wrap truncate max-w-lg">{fullAddress}</span>
                            </div>
                          )}

                          {/* GSTIN */}
                          {warehouse.gstinNumber && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-3.5 w-3.5 shrink-0" />
                              <span className="font-mono text-xs">GSTIN: {warehouse.gstinNumber}</span>
                            </div>
                          )}

                          {/* Total Area */}
                          {/* {warehouse.totalArea && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Ruler className="h-3.5 w-3.5 shrink-0" />
                              <span className="text-xs">
                                Area: {warehouse.totalArea.toLocaleString()} sq ft
                              </span>
                            </div>
                          )}
                           */}
                          {/* Status Badge */}
                          {warehouse.isActive && (
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                  warehouse.isActive.toLowerCase() === "active" || warehouse.isActive === "1"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {warehouse.isActive.toLowerCase() === "active" || warehouse.isActive === "1"
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          )}
                        </div>

                        <Check
                          className={cn("h-4 w-4 shrink-0 mt-1", isSelected ? "opacity-100 text-primary" : "opacity-0")}
                        />
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

