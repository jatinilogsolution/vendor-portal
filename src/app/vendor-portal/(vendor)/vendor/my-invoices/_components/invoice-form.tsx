// src/app/vendor-portal/(vendor)/vendor/my-invoices/_components/invoice-form.tsx
"use client"

import {
  useEffect, useState, useTransition, useRef, useCallback,
} from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  IconPlus, IconTrash, IconUpload,
  IconFile, IconX,
} from "@tabler/icons-react"
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VpTotalsBar } from "@/components/ui/vp-totals-bar"
import { vpInvoiceSchema, VpInvoiceFormValues } from "@/validations/vp/invoice"
import {
  createVpInvoice, updateVpInvoice,
  getVendorPosForInvoice, addVpInvoiceDocument,
  getVpInvoiceById, VpInvoiceDetail,
} from "@/actions/vp/invoice.action"
import { getMyVpInvoiceCompanyConfig } from "@/actions/vp/company.action"
import {
  getMyRecurringSchedules, VpRecurringRow,
} from "@/actions/vp/recurring.action"
import {
  getAllBillToAddresses,
  getBillToForPo,
} from "@/actions/vp/bill-to.action"

import {
  getPoLineItemsForInvoice,
} from "@/actions/vp/delivery.action"
import { VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"
import { uploadAttachmentToAzure } from "@/services/azure-blob"

interface InvoiceFormProps {
  editing?: VpInvoiceDetail | null
}

type PoOption = {
  id: string
  poNumber: string
  grandTotal: number
  companyId: string | null
  companyName: string | null
}
type BillToOption = { id: string; name: string; address: string; gstin: string }
type CompanyOption = { id: string; name: string; code: string | null; gstin: string | null }

function vpInvoiceDocPath(scope: string, invoiceId: string, fileName: string) {
  const safeFile = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_")
  return `vp/invoices/${scope}/${invoiceId}/${Date.now()}_${safeFile}`
}

export function InvoiceForm({ editing }: InvoiceFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillScheduleId = searchParams.get("scheduleId") ?? ""
  const prefillBillType = searchParams.get("billType") ?? ""
  const prefillRecurringCycle = searchParams.get("recurringCycle") ?? ""
  const copyFromInvoiceId = searchParams.get("copyFrom") ?? ""

  const [isPending, startTransition] = useTransition()
  const [pos, setPos] = useState<PoOption[]>([])
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [defaultInvoiceCompanyId, setDefaultInvoiceCompanyId] = useState<string | null>(null)
  const [restrictInvoiceToDefaultCompany, setRestrictInvoiceToDefaultCompany] = useState(false)
  const [billToOpts, setBillToOpts] = useState<BillToOption[]>([])
  const [schedules, setSchedules] = useState<VpRecurringRow[]>([])
  const [selectedRecurringSourceId, setSelectedRecurringSourceId] = useState(
    editing?.recurringScheduleId ?? prefillScheduleId ?? "",
  )
  const [poItemsLoading, setPoLoading] = useState(false)
  const [uploadingFile, setUploading] = useState(false)
  const [copyingInvoice, setCopyingInvoice] = useState(false)
  const [uploadedFileUrl, setFileUrl] = useState<string | null>(
    editing?.documents?.[0]?.filePath ?? null,
  )
  const fileRef = useRef<HTMLInputElement>(null)
  const didPrefillCopyRef = useRef(false)
  const isEditing = !!editing

  type VpInvoiceFormInput = z.input<typeof vpInvoiceSchema>

  const form = useForm<VpInvoiceFormInput, unknown, VpInvoiceFormValues>({
    resolver: zodResolver(vpInvoiceSchema),
    defaultValues: {
      invoiceNumber: editing?.invoiceNumber ?? "",
      billType: "STANDARD",
      type: (editing?.type ?? "DIGITAL") as "PDF" | "DIGITAL",
      companyId: editing?.companyId ?? "",
      billToId: editing?.billToId ?? "",
      billTo: editing?.billTo ?? "",
      billToGstin: editing?.billToGstin ?? "",
      poId: editing?.poId ?? "",
      notes: editing?.notes ?? "",
      discountAmount: editing?.discountAmount ?? 0,
      taxRate: editing?.taxRate ?? 18,
      recurringScheduleId: editing?.recurringScheduleId ?? "",
      parentInvoiceId: editing?.parentInvoiceId ?? "",
      items: editing?.items.map((i) => ({
        poLineItemId: i.poLineItemId ?? "",
        description: i.description,
        qty: i.qty,
        unitPrice: i.unitPrice,
        tax: i.tax,
        total: i.total,
      })) ?? [{ poLineItemId: "", description: "", qty: 1, unitPrice: 0, tax: 0, total: 0 }],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const billType = form.watch("billType")
  const invoiceType = form.watch("type")
  const invoiceTaxRate = useWatch({ control: form.control, name: "taxRate" }) ?? 0
  const invoiceDiscountAmount = useWatch({ control: form.control, name: "discountAmount" }) ?? 0
  const selectedScheduleId = form.watch("recurringScheduleId")
  const selectedPoId = form.watch("poId")
  const selectedCompanyId = form.watch("companyId")
  const selectedBillToId = form.watch("billToId")
  const selectedRecurringOption = schedules.find((schedule) => schedule.id === selectedRecurringSourceId)
    ?? schedules.find((schedule) => schedule.sourceType === "SCHEDULE" && schedule.id === selectedScheduleId)
  const inferredRecurringCycle = billType === "RECURRING" && !selectedRecurringOption && schedules.length === 1
    ? schedules[0]?.cycle
    : ""
  const activeRecurringCycle = selectedRecurringOption?.cycle || inferredRecurringCycle || prefillRecurringCycle

  const applyRecurringOption = useCallback((option: VpRecurringRow | null) => {
    setSelectedRecurringSourceId(option?.id ?? "")
    form.setValue("recurringScheduleId", option?.sourceType === "SCHEDULE" ? option.id : "")

    if (!option) return

    if (option.itemsSnapshot.length > 0) {
      replace(
        (option.itemsSnapshot as any[]).map((item) => ({
          poLineItemId: "",
          description: item.description,
          qty: item.qty,
          unitPrice: item.unitPrice,
          tax: Number(form.getValues("taxRate") ?? 0),
          total: item.qty * item.unitPrice,
        })),
      )
    }

    form.setValue(
      "notes",
      `Recurring — ${option.title} (${option.cycle}) | Due: ${new Date(option.nextDueDate).toLocaleDateString("en-IN")}`,
    )
  }, [form, replace])

  // ── Load reference data ──────────────────────────────────────

  useEffect(() => {
    Promise.all([
      getVendorPosForInvoice(),
      getMyVpInvoiceCompanyConfig(),
      getAllBillToAddresses(),
      getMyRecurringSchedules(),
    ]).then(([poRes, companyRes, billRes, schRes]) => {
      if (poRes.success) setPos(poRes.data)
      if (companyRes.success) {
        setCompanies(companyRes.data.companies.map((company) => ({
          id: company.id,
          name: company.name,
          code: company.code,
          gstin: company.gstin,
        })))
        setDefaultInvoiceCompanyId(companyRes.data.defaultInvoiceCompanyId)
        setRestrictInvoiceToDefaultCompany(companyRes.data.restrictInvoiceToDefaultCompany)
        if (!editing) {
          form.setValue(
            "companyId",
            companyRes.data.defaultInvoiceCompanyId ?? companyRes.data.companies[0]?.id ?? "",
          )
        }
      }
      setBillToOpts(billRes)
      if (schRes.success) setSchedules(schRes.data)
    })
  }, [editing, form])

  // Pre-fill if schedule in URL
  useEffect(() => {
    if (copyFromInvoiceId) return
    if (prefillScheduleId && schedules.length > 0) {
      const s = schedules.find((x) => x.id === prefillScheduleId)
      if (s) {
        form.setValue("billType", "RECURRING")
        form.setValue("parentInvoiceId", "")
        applyRecurringOption(s)
      }
    }
  }, [applyRecurringOption, copyFromInvoiceId, form, prefillScheduleId, schedules])

  useEffect(() => {
    if (isEditing || copyFromInvoiceId || prefillScheduleId || prefillBillType !== "RECURRING") return
    form.setValue("billType", "RECURRING")
  }, [copyFromInvoiceId, form, isEditing, prefillBillType, prefillScheduleId])

  useEffect(() => {
    if (isEditing || !copyFromInvoiceId || didPrefillCopyRef.current) return

    let active = true
    setCopyingInvoice(true)

    getVpInvoiceById(copyFromInvoiceId)
      .then((res) => {
        if (!active || !res.success) {
          if (active && !res.success) toast.error(res.error)
          return
        }

        didPrefillCopyRef.current = true
        const copiedPoId = res.data.billType === "RECURRING" ? "" : (res.data.poId ?? "")
        form.reset({
          invoiceNumber: "",
          billType: res.data.billType === "RECURRING" ? "RECURRING" : "STANDARD",
          type: res.data.type as "PDF" | "DIGITAL",
          companyId: res.data.companyId ?? "",
          billToId: res.data.billToId ?? "",
          billTo: res.data.billTo ?? "",
          billToGstin: res.data.billToGstin ?? "",
          poId: copiedPoId,
          notes: res.data.notes ?? "",
          discountAmount: res.data.discountAmount ?? 0,
          taxRate: res.data.taxRate ?? 18,
          recurringScheduleId: prefillScheduleId || res.data.recurringScheduleId || "",
          parentInvoiceId: res.data.id,
          items: res.data.items.map((item) => ({
            poLineItemId: copiedPoId ? (item.poLineItemId ?? "") : "",
            description: item.description,
            qty: item.qty,
            unitPrice: item.unitPrice,
            tax: res.data.taxRate,
            total: item.qty * item.unitPrice,
          })),
        })
        setSelectedRecurringSourceId(prefillScheduleId || res.data.recurringScheduleId || "")

        setFileUrl(null)
        toast.success("Previous invoice copied. Update invoice number and details before saving.")
      })
      .finally(() => {
        if (active) setCopyingInvoice(false)
      })

    return () => {
      active = false
    }
  }, [copyFromInvoiceId, editing, form, isEditing, prefillScheduleId])

  useEffect(() => {
    if (schedules.length === 0) return
    if (selectedRecurringSourceId && schedules.some((schedule) => schedule.id === selectedRecurringSourceId)) return

    if (selectedScheduleId) {
      setSelectedRecurringSourceId(selectedScheduleId)
      return
    }

    if (editing?.billType === "RECURRING" && editing.recurringCycle) {
      const matchingOption = schedules.find((schedule) => schedule.cycle === editing.recurringCycle)
      if (matchingOption) {
        setSelectedRecurringSourceId(matchingOption.id)
        return
      }
    }

    if (billType === "RECURRING" && schedules.length === 1) {
      setSelectedRecurringSourceId(schedules[0].id)
    }
  }, [
    billType,
    editing?.billType,
    editing?.recurringCycle,
    schedules,
    selectedRecurringSourceId,
    selectedScheduleId,
  ])

  // When PO selected — auto-fill line items (locked) + bill-to
  // Replace handlePoSelect with this version:
  const handlePoSelect = useCallback(async (poId: string) => {
    form.setValue("poId", poId)

    if (!poId) {
      // Clear lock, reset items to one empty row
      replace([{ poLineItemId: "", description: "", qty: 1, unitPrice: 0, tax: Number(form.getValues("taxRate") ?? 0), total: 0 }])
      return
    }

    setPoLoading(true)
    try {
      // 1. Auto-fill line items from PO
      const itemRes = await getPoLineItemsForInvoice(poId)
      if (itemRes.success && itemRes.data.length > 0) {
        const invoiceableItems = itemRes.data.filter((li) => li.invoiceableQty > 0)
        if (invoiceableItems.length === 0) {
          replace([])
          toast.error("No invoiceable delivered quantity is available for this PO yet")
          return
        }
        replace(
          invoiceableItems.map((li) => ({
            poLineItemId: li.id,
            description: li.description,
            qty: li.invoiceableQty,
            unitPrice: li.unitPrice,
            tax: Number(form.getValues("taxRate") ?? 0),
            total: li.invoiceableQty * li.unitPrice,
          })),
        )
        toast.success("Invoice quantities auto-filled from PO availability")
      }

      const selectedPo = pos.find((po) => po.id === poId)
      if (selectedPo?.companyId) {
        form.setValue("companyId", selectedPo.companyId)
      }

      // 2. Auto-fill bill-to from PO delivery address
      const billRes = await getBillToForPo(poId)
      if (billRes?.billTo) {
        // If we got a billToId match, select it in dropdown
        if (billRes.billToId) {
          form.setValue("billToId", billRes.billToId)
          form.setValue("billTo", billRes.billTo)
          form.setValue("billToGstin", billRes.billToGstin ?? "")
        } else {
          // No exact match — just fill the text fields
          // Try to find a matching warehouse by address text
          const match = billToOpts.find(
            (b) => b.address.toLowerCase().includes(
              (billRes.billTo ?? "").toLowerCase().slice(0, 20),
            ),
          )
          if (match) {
            form.setValue("billToId", match.id)
            form.setValue("billTo", match.address)
            form.setValue("billToGstin", match.gstin)
          }
        }
      }
    } finally {
      setPoLoading(false)
    }
  }, [form, replace, billToOpts, pos])

  // Bill-to auto-fill name/gstin when selected
  const handleBillToSelect = (id: string) => {
    form.setValue("billToId", id)
    const opt = billToOpts.find((b) => b.id === id)
    if (opt) {
      form.setValue("billTo", opt.address)
      form.setValue("billToGstin", opt.gstin)
    }
  }

  useEffect(() => {
    if (companies.length === 0) return

    const currentCompanyId = form.getValues("companyId")
    const hasCurrentCompany = companies.some((company) => company.id === currentCompanyId)
    if (hasCurrentCompany && !restrictInvoiceToDefaultCompany) return

    if (restrictInvoiceToDefaultCompany && defaultInvoiceCompanyId) {
      form.setValue("companyId", defaultInvoiceCompanyId)
      return
    }

    if (!hasCurrentCompany) {
      form.setValue("companyId", defaultInvoiceCompanyId ?? companies[0]?.id ?? "")
    }
  }, [companies, defaultInvoiceCompanyId, form, restrictInvoiceToDefaultCompany])

  useEffect(() => {
    fields.forEach((_, index) => {
      if (form.getValues(`items.${index}.tax`) !== Number(invoiceTaxRate)) {
        form.setValue(`items.${index}.tax`, Number(invoiceTaxRate))
      }
    })
  }, [fields, form, invoiceTaxRate])

  // ── File upload ──────────────────────────────────────────────

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const path = vpInvoiceDocPath("vendor", `temp-${Date.now()}`, file.name)
      const url = await uploadAttachmentToAzure(path, formData)
      setFileUrl(url)
      toast.success("File uploaded — will be attached when invoice is saved")
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  // ── Submit ───────────────────────────────────────────────────

  const onSubmit = (values: VpInvoiceFormValues) => {
    startTransition(async () => {
      const result = isEditing
        ? await updateVpInvoice(editing.id, values)
        : await createVpInvoice(values)

      if (!result.success) { toast.error(result.error); return }

      const invoiceId = isEditing
        ? editing.id
        : (result as any).data?.id

      // Attach uploaded file if any
      if (invoiceId && uploadedFileUrl) {
        await addVpInvoiceDocument(invoiceId, uploadedFileUrl)
      }

      toast.success(isEditing ? "Invoice updated" : "Invoice created")
      router.push(
        isEditing
          ? `/vendor-portal/vendor/my-invoices/${editing.id}`
          : `/vendor-portal/vendor/my-invoices/${invoiceId}`,
      )
    })
  }

  // Items are locked when PO is selected
  const itemsLocked = !!selectedPoId

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Section 1: Invoice details ────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {copyFromInvoiceId && !isEditing && (
              <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                {copyingInvoice
                  ? "Loading previous recurring invoice..."
                  : "This draft is prefilled from the previous recurring invoice. You can edit items, discount, invoice number, and notes before saving."}
              </div>
            )}

            {billType === "RECURRING" && (
              <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                <Badge variant="outline">Recurring Bill</Badge>
                {activeRecurringCycle && (
                  <Badge variant="secondary">
                    {VP_RECURRING_CYCLE_LABELS[activeRecurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS] ?? activeRecurringCycle}
                  </Badge>
                )}
                {!activeRecurringCycle && (
                  <span className="text-xs text-muted-foreground">
                    Select the recurring frequency for this bill.
                  </span>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Invoice number */}
              <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Invoice No. <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. INV-2025-001" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Number from your own records.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Bill type — STANDARD or RECURRING only */}
              <FormField control={form.control} name="billType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard Invoice</SelectItem>
                      <SelectItem value="RECURRING">Recurring Bill</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Select the type of invoice you are submitting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Invoice format */}
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DIGITAL">Digital (fill form)</SelectItem>
                      <SelectItem value="PDF">PDF Upload</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    {invoiceType === "PDF"
                      ? "You will upload your invoice PDF below."
                      : "Line items entered below generate the invoice."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="companyId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={restrictInvoiceToDefaultCompany}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    {restrictInvoiceToDefaultCompany
                      ? "Your account is restricted to the configured default raise company."
                      : "Select the company against which you are raising this invoice."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              {/* GST Rate */}
              <FormField control={form.control} name="taxRate" render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Rate (%)</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[0, 5, 12, 18, 28].map((r) => (
                        <SelectItem key={r} value={String(r)}>{r}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    This is the single GST applied across the invoice. Item rows now follow this same GST rate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="discountAmount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Applied once at invoice level before GST. Line items below stay undiscounted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Recurring schedule picker — only when RECURRING */}
              {billType === "RECURRING" && (
                <FormField control={form.control} name="recurringScheduleId" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Recurring Setup</FormLabel>
                    <Select
                      value={selectedRecurringSourceId || "none"}
                      onValueChange={(v) => {
                        const nextOption = v === "none" ? null : schedules.find((x) => x.id === v) ?? null
                        field.onChange(nextOption?.sourceType === "SCHEDULE" ? nextOption.id : "")
                        applyRecurringOption(nextOption)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your recurring schedule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {/* <SelectItem value="none">—None/SelectItem> */}
                          {schedules.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.cycle} -
                              {new Date(s.nextDueDate).toLocaleDateString("en-IN")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      {selectedRecurringOption?.sourceType === "BILLING_CONFIG"
                        ? "Using the vendor's assigned recurring frequency. This keeps the invoice recurring without requiring an admin-created schedule."
                        : "Select an admin schedule or vendor frequency to prefill recurring details."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>

            {/* Notes */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes / Remarks</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Bank details, delivery info, or any other remarks…"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* ── Section 2: Against PO (optional) ─────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Link to Purchase Order
              <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField control={form.control} name="poId" render={({ field }) => (
              <FormItem>
                <Select
                  value={field.value || "none"}
                  onValueChange={(v) => handlePoSelect(v === "none" ? "" : v)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      {poItemsLoading
                        ? <span className="text-muted-foreground text-sm">Loading items…</span>
                        : <SelectValue placeholder="Select a PO (items will be auto-filled)" />
                      }
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">— Not against a PO —</SelectItem>
                      {pos.map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          <span className="font-mono font-semibold">{po.poNumber}</span>
                          <span className="ml-2 text-muted-foreground">
                            ₹{po.grandTotal.toLocaleString("en-IN")}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {selectedPoId && (
                  <FormDescription className="flex items-center gap-1.5 text-xs text-amber-600">
                    <span>🔒</span>
                    Line items are locked to the PO. You cannot add or modify them.
                  </FormDescription>
                )}
                {selectedPoId && (
                  <FormDescription className="text-xs">
                    Invoice quantity is taken from delivered quantity still not invoiced. If no delivery is recorded yet, it falls back to PO quantity. Extra delivered quantity is also supported.
                  </FormDescription>
                )}
                {selectedPoId && selectedCompanyId && (
                  <FormDescription className="text-xs">
                    The company is auto-aligned from the selected purchase order.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* ── Section 3: Bill-to address ────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="billToId" render={({ field }) => (
              <FormItem>
                <FormLabel>Select Address <span className="text-destructive">*</span></FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={handleBillToSelect}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select warehouse / delivery address" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {billToOpts.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No addresses found — check API configuration
                        </SelectItem>
                      ) : (
                        billToOpts.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{b.name}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-72">
                                {b.address}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Show selected address + GSTIN */}
            {selectedBillToId && (
              <div className="rounded-md border bg-muted/30 p-3 space-y-1 text-sm">
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                  Selected Bill-To
                </p>
                <p className="text-sm">{form.watch("billTo") || "—"}</p>
                {form.watch("billToGstin") && (
                  <p className="text-xs text-muted-foreground">
                    GSTIN: <code>{form.watch("billToGstin")}</code>
                  </p>
                )}
              </div>
            )}

            {/* Hidden fields to carry values */}
            <input type="hidden" {...form.register("billTo")} />
            <input type="hidden" {...form.register("billToGstin")} />
          </CardContent>
        </Card>

        {/* ── Section 4: PDF Upload (optional for PDF type) ─── */}
        {invoiceType === "PDF" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Invoice File
                <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Attach your PDF invoice. This is optional — you can still fill in
                line items below for the digital record.
              </p>

              {uploadedFileUrl ? (
                <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-4 py-3">
                  <IconFile size={18} className="shrink-0 text-muted-foreground" />
                  <a
                    href={uploadedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 truncate text-sm text-primary hover:underline"
                  >
                    {uploadedFileUrl.split("/").pop()}
                  </a>
                  <Button
                    type="button" variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => setFileUrl(null)}
                  >
                    <IconX size={13} />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed py-8 transition-colors hover:bg-muted/30"
                  onClick={() => fileRef.current?.click()}
                >
                  <IconUpload size={22} className="mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {uploadingFile ? "Uploading…" : "Click to upload invoice PDF"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    PDF, JPG or PNG · max 10 MB
                  </p>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploadingFile}
              />
            </CardContent>
          </Card>
        )}

        {/* ── Section 5: Line items ─────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Line Items
                {itemsLocked && (
                  <Badge variant="outline" className="ml-2 text-[10px]">
                    🔒 Locked to PO
                  </Badge>
                )}
              </CardTitle>
              {!itemsLocked && (
                <Button
                  type="button" variant="outline" size="sm"
                  onClick={() => append({
                    poLineItemId: "",
                    description: "", qty: 1, unitPrice: 0, tax: Number(form.getValues("taxRate") ?? 0), total: 0,
                  })}
                >
                  <IconPlus size={13} className="mr-1" />
                  Add Item
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {selectedPoId
                  ? (poItemsLoading ? "Loading items from PO…" : "No invoiceable quantity is available for this PO yet.")
                  : "Add at least one line item."}
              </p>
            )}

            {fields.map((field, index) => {
              const qty = form.watch(`items.${index}.qty`) ?? 0
              const unitPrice = form.watch(`items.${index}.unitPrice`) ?? 0
              const total = Number(qty) * Number(unitPrice)

              return (
                <div key={field.id} className="rounded-md border bg-muted/20 p-3">
                  <div className="grid grid-cols-14 items-end gap-2">

                    {/* Description */}
                    <div className="col-span-14 sm:col-span-5">
                      <p className="mb-1 text-xs text-muted-foreground">Description *</p>
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-8 text-xs"
                                disabled={itemsLocked}
                                {...f}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Qty */}
                    <div className="col-span-4 sm:col-span-1">
                      <p className="mb-1 text-xs text-muted-foreground">Qty</p>
                      <FormField
                        control={form.control}
                        name={`items.${index}.qty`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number" min={0} step={0.01}
                                className="h-8 text-xs"
                                disabled={itemsLocked}
                                {...f}
                                onChange={(e) => {
                                  f.onChange(e)
                                  form.setValue(
                                    `items.${index}.total`,
                                    Number(e.target.value) * Number(unitPrice),
                                  )
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-4 sm:col-span-2">
                      <p className="mb-1 text-xs text-muted-foreground">Unit Price</p>
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number" min={0} step={0.01}
                                className="h-8 text-xs"
                                disabled={itemsLocked}
                                {...f}
                                onChange={(e) => {
                                  f.onChange(e)
                                  form.setValue(
                                    `items.${index}.total`,
                                    Number(qty) * Number(e.target.value),
                                  )
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* GST basis */}
                    <div className="col-span-5 sm:col-span-2">
                      <p className="mb-1 text-xs text-muted-foreground">GST</p>
                      <div className="flex h-8 items-center justify-center rounded-md border bg-muted/40 text-xs font-medium">
                        {Number(invoiceTaxRate)}% invoice GST
                      </div>
                      <input type="hidden" {...form.register(`items.${index}.tax`)} />
                    </div>

                    {/* Discount basis */}
                    <div className="col-span-6 sm:col-span-2">
                      <p className="mb-1 text-xs text-muted-foreground">Discount Basis</p>
                      <div className="flex h-8 items-center justify-center rounded-md border bg-muted/40 px-2 text-center text-[11px] font-medium">
                        {Number(invoiceDiscountAmount) > 0 ? "Overall invoice" : "No discount"}
                      </div>
                    </div>

                    {/* Total (read-only) */}
                    <div className="col-span-4 sm:col-span-1">
                      <p className="mb-1 text-xs text-muted-foreground">Total</p>
                      <div className="flex h-8 items-center rounded-md border bg-muted px-2 text-xs font-semibold">
                        ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </div>
                    </div>

                    {/* Remove */}
                    {!itemsLocked && (
                      <div className="col-span-3 sm:col-span-1 flex items-end pb-0.5">
                        <Button
                          type="button" variant="ghost" size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <IconTrash size={13} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {fields.length > 0 && (
              <>
                <Separator />
                <VpTotalsBar
                  itemsField="items"
                  taxRateField="taxRate"
                  discountAmountField="discountAmount"
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* ── Actions ───────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button" variant="outline"
            onClick={() => router.push("/vendor-portal/vendor/my-invoices")}
            disabled={isPending || copyingInvoice}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || uploadingFile || copyingInvoice}>
            {isPending ? "Saving…" : isEditing ? "Save Changes" : "Create Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
