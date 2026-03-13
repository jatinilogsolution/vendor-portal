"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVirtualizer } from "@tanstack/react-virtual";

type Vendor = {
  id: string;
  name: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  gstNumber?: string | null;
};

type Category = {
  id: string;
  name: string;
  status: string;
};

type VpVendor = {
  id: string;
  existingVendorId: string;
  portalStatus: string;
  vendorType: string;
  billingType?: string | null;
  recurringCycle?: string | null;
  categoryId?: string | null;
  existingVendor: Vendor;
  category?: Category | null;
};

const vendorTypeOptions = ["STANDARD", "IT"] as const;
const billingTypeOptions = ["ONE_TIME", "RECURRING", "RENTAL"] as const;
const recurringOptions = ["MONTHLY", "QUARTERLY", "YEARLY"] as const;

export default function VendorProfilesPage({
  vendors,
  vpVendors,
  categories,
  onCreate,
  onUpdate,
}: {
  vendors: Vendor[];
  vpVendors: VpVendor[];
  categories: Category[];
  onCreate: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onUpdate: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [vendorSearch, setVendorSearch] = useState("");
  const [portalSearch, setPortalSearch] = useState("");
  const scrollParentRef = useRef<HTMLDivElement | null>(null);

  const availableVendors = useMemo(() => {
    const existing = new Set(vpVendors.map((v) => v.existingVendorId));
    return vendors.filter((v) => !existing.has(v.id));
  }, [vendors, vpVendors]);

  const filteredAvailableVendors = useMemo(() => {
    if (!vendorSearch) return availableVendors;
    const term = vendorSearch.toLowerCase();
    return availableVendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(term)
    );
  }, [availableVendors, vendorSearch]);

  const filteredVpVendors = useMemo(() => {
    if (!portalSearch) return vpVendors;
    const term = portalSearch.toLowerCase();
    return vpVendors.filter((vpVendor) => {
      const name = vpVendor.existingVendor?.name?.toLowerCase() || "";
      const email = vpVendor.existingVendor?.contactEmail?.toLowerCase() || "";
      return name.includes(term) || email.includes(term);
    });
  }, [portalSearch, vpVendors]);

  const virtualizer = useVirtualizer({
    count: filteredVpVendors.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 180,
    overscan: 10,
  });

  const handleCreate = async (formData: FormData) => {
    setErrorMessage(null);
    const res = await onCreate(formData);
    if (res?.error) setErrorMessage(res.error);
  };

  const handleUpdate = async (formData: FormData) => {
    setErrorMessage(null);
    const res = await onUpdate(formData);
    if (res?.error) setErrorMessage(res.error);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Vendor Portal Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? (
            <div className="text-sm text-destructive">{errorMessage}</div>
          ) : null}
          <form action={handleCreate} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Existing Vendor</label>
              <Input
                value={vendorSearch}
                onChange={(event) => setVendorSearch(event.target.value)}
                placeholder="Search vendor..."
              />
              <Select name="existingVendorId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {filteredAvailableVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select name="categoryId" defaultValue="__none__">
                <SelectTrigger>
                  <SelectValue placeholder="Assign category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Unassigned</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vendor Type</label>
              <Select name="vendorType" defaultValue="STANDARD">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {vendorTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Type</label>
              <Select name="billingType" defaultValue="__none__">
                <SelectTrigger>
                  <SelectValue placeholder="Billing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {billingTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recurring Cycle</label>
              <Select name="recurringCycle" defaultValue="__none__">
                <SelectTrigger>
                  <SelectValue placeholder="Recurring cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {recurringOptions.map((cycle) => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button type="submit">Create Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portal Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 pb-4">
            <Input
              value={portalSearch}
              onChange={(event) => setPortalSearch(event.target.value)}
              placeholder="Search vendor profile..."
            />
            <Badge variant="secondary">{filteredVpVendors.length} total</Badge>
          </div>

          {filteredVpVendors.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No vendor profiles created yet.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[2fr_1.2fr_0.8fr_1.2fr_0.8fr_1.5fr] gap-3 text-xs font-semibold text-muted-foreground pb-2">
                <div>Vendor</div>
                <div>Category</div>
                <div>Type</div>
                <div>Billing</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              <div
                ref={scrollParentRef}
                className="border rounded-md max-h-155 overflow-auto"
              >
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    position: "relative",
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const vpVendor = filteredVpVendors[virtualRow.index];
                    return (
                      <div
                        key={vpVendor.id}
                        ref={virtualizer.measureElement}
                        data-index={virtualRow.index}
                        className="border-b px-3 py-4"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div className="grid grid-cols-[2fr_1.2fr_0.8fr_1.2fr_0.8fr_1.5fr] gap-3 items-start">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {vpVendor.existingVendor.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {vpVendor.existingVendor.contactEmail || "No email"}
                            </div>
                          </div>
                          <div>{vpVendor.category?.name || "Unassigned"}</div>
                          <div>
                            <Badge variant="secondary">{vpVendor.vendorType}</Badge>
                          </div>
                          <div className="space-y-1">
                            <div>{vpVendor.billingType || "None"}</div>
                            <div className="text-xs text-muted-foreground">
                              {vpVendor.recurringCycle || "—"}
                            </div>
                          </div>
                          <div>
                            <Badge
                              variant={
                                vpVendor.portalStatus === "ACTIVE"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {vpVendor.portalStatus}
                            </Badge>
                          </div>
                          <div>
                            <form action={handleUpdate} className="flex flex-col gap-2">
                              <input type="hidden" name="vpVendorId" value={vpVendor.id} />
                              <Select name="portalStatus" defaultValue={vpVendor.portalStatus}>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select name="categoryId" defaultValue={vpVendor.categoryId || "__none__"}>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">Unassigned</SelectItem>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select name="vendorType" defaultValue={vpVendor.vendorType}>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {vendorTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select name="billingType" defaultValue={vpVendor.billingType || "__none__"}>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Billing" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">None</SelectItem>
                                  {billingTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select name="recurringCycle" defaultValue={vpVendor.recurringCycle || "__none__"}>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">None</SelectItem>
                                  {recurringOptions.map((cycle) => (
                                    <SelectItem key={cycle} value={cycle}>
                                      {cycle}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button type="submit" size="sm" variant="secondary">
                                Save
                              </Button>
                            </form>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
