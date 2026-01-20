"use client"

import React, { useEffect, useState } from "react"
import { redirect, RedirectType, useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {  Trash2, Plus, FilePlus, Save, AlertCircle, CheckCircle, XCircle, Link2, FileQuestion, Loader2, CircleCheckBig } from 'lucide-react'
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadPod } from "../../../_components/upload-pod"
 import { useSession } from "@/lib/auth-client"
import { UserRoleEnum, AnnexureStatus } from "@/utils/constant"
import { setLrPrice } from "../../../_action/lorry"
import ExtraCostManager from "@/components/modules/extra-cost-manager"
import { Label } from "@/components/ui/label"
import { canEditAnnexure } from "@/utils/workflow-validator"

type LR = {
    id: string
    LRNumber: string
    vehicleNo?: string
    vehicleType?: string
    outDate?: string | null
    lrPrice?: number | null
    extraCost?: number | null
    podlink?: string | null
    fileNumber?: string | null
    remark?: string | null
    isInvoiced?: boolean | null
    CustomerName: string
    origin: string
}

type FileGroup = {
    id: string
    fileNumber: string
    totalPrice?: number | null
    extraCost?: number | null
    remark?: string | null
    vendorName: string
    LRs: LR[]
}

type ValidationIssue = {
    lrNumber: string
    type: "missing_pod" | "already_annexed" | "already_invoiced" | "not_found" | "duplicate_in_file" | "wrong_vendor" | "missing_in_file"
    message: string
}

function ValidationIssuesDialog({
    open,
    onOpenChange,
    issues,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    issues: ValidationIssue[]
}) {
    const groupedIssues = issues.reduce(
        (acc, issue) => {
            if (!acc[issue.type]) acc[issue.type] = []
            acc[issue.type].push(issue)
            return acc
        },
        {} as Record<string, ValidationIssue[]>
    )

    const typeConfig: Record<string, { icon: React.ReactNode; color: string; title: string }> = {
        not_found: { icon: <FileQuestion className="w-4 h-4" />, color: "text-gray-600", title: "Not Found in Database" },
        already_annexed: { icon: <Link2 className="w-4 h-4" />, color: "text-blue-600", title: "Already in Another Annexure" },
        already_invoiced: { icon: <XCircle className="w-4 h-4" />, color: "text-green-600", title: "Already Invoiced" },
        missing_pod: { icon: <AlertCircle className="w-4 h-4" />, color: "text-amber-600", title: "POD Not Uploaded" },
        duplicate_in_file: { icon: <AlertCircle className="w-4 h-4" />, color: "text-orange-600", title: "Duplicate in File" },
        wrong_vendor: { icon: <XCircle className="w-4 h-4" />, color: "text-red-600", title: "Wrong Vendor (Not Yours)" },
        missing_in_file: { icon: <AlertCircle className="w-4 h-4" />, color: "text-amber-500", title: "Missing LRs in File" },
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Validation Issues - {issues.length} Problem(s) Found</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue={Object.keys(groupedIssues)[0]} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        {Object.entries(groupedIssues).map(([type, list]) => (
                            <TabsTrigger key={type} value={type} className="text-xs">
                                {list.length}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {Object.entries(groupedIssues).map(([type, list]) => {
                        const config = typeConfig[type as keyof typeof typeConfig]
                        return (
                            <TabsContent key={type} value={type} className="space-y-3 mt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={config.color}>{config.icon}</span>
                                    <span className="font-semibold">{config.title}</span>
                                    <Badge variant="secondary">{list.length}</Badge>
                                </div>

                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {list.map((issue, idx) => (
                                        <Alert key={idx} className="border-l-4">
                                            <AlertDescription className="flex items-center justify-between">
                                                <span>
                                                    <strong>{issue.lrNumber}</strong>
                                                </span>
                                                <span className="text-xs text-muted-foreground">{issue.message}</span>
                                            </AlertDescription>
                                        </Alert>
                                    ))}
                                </div>
                            </TabsContent>
                        )
                    })}
                </Tabs>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function StatusBadge({ status, message }: { status: string; message: string }) {
    const variants: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
        pod_missing: {
            icon: <AlertCircle className="w-4 h-4" />,
            color: "text-amber-500",
            bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-500/30 border-amber-950",
        },
        pod_present: {
            icon: <CheckCircle className="w-4 h-4" />,
            color: "text-green-500",
            bgColor: "bg-green-50 border-green-200  dark:bg-green-500/30 border-green-950",
        },
        invoiced: { icon: <CircleCheckBig className="w-4 h-4" />, color: "text-green-500", bgColor: "bg-green-50 border-green-200 dark:bg-green-500/30 border-green-950" },
        annexed: { icon: <Link2 className="w-4 h-4" />, color: "text-blue-500", bgColor: "bg-blue-50 border-blue-200  dark:bg-blue-500/30 border-blue-950" },
    }
    const config = variants[status] || variants.pod_missing
    return (
        <Badge className={`${config.bgColor} ${config.color}`}>
            {config.icon}
            <span>{message}</span>
        </Badge>
    )
}

export default function AnnexureEditPage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const session = useSession()
    const [loading, setLoading] = useState(false)
    const [groups, setGroups] = useState<FileGroup[]>([])
    const [annexureName, setAnnexureName] = useState("")
    // const [fromDate, setFromDate] = useState("")
    // const [toDate, setToDate] = useState("")
    const [addInput, setAddInput] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [processingFile, setProcessingFile] = useState(false)
    const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([])
    const [showValidationDialog, setShowValidationDialog] = useState(false)
    const [isInvoiced, setIsInvoiced] = useState(false)
    const [vendorId, setVendorId] = useState<string | null>(null)

    // Authorization check
    const role = session.data?.user?.role
    const isAdmin = role !== undefined && role !== null &&
        [UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(role as UserRoleEnum)

    useEffect(() => {
        // Redirect admins to view page - they shouldn't edit
        if (isAdmin) {
            toast.error("Admins cannot edit annexures. Redirecting to view page.")
            router.replace(`/lorries/annexure/${id}`)
            return
        }
        fetchAnnexure()
    }, [id, isAdmin])

    async function fetchAnnexure() {
        try {
            setLoading(true)
            const res = await fetch(`/api/lorries/annexures/${id}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to load")

            setAnnexureName(data.name || "")

            // Extract vendorId from first LR for validation
            const firstVendorId = data.groups?.[0]?.LRs?.[0]?.tvendor?.id
            if (firstVendorId) {
                setVendorId(firstVendorId)
            }

            // Check if vendor can edit based on status using central validator
            const editCheck = canEditAnnexure(role as string, { 
                status: data.status as AnnexureStatus, 
                isInvoiced: data.isInvoiced 
            })

            if (!editCheck.canEdit) {
                toast.error(editCheck.reason || `Annexure in ${data.status} status cannot be edited.`)
                router.replace(`/lorries/annexure/${id}`)
                return
            }
            console.log(data.groups[0].LRs[0])

            const g: FileGroup[] = (data.groups || []).map((grp: any) => ({
                id: grp.id,
                fileNumber: grp.fileNumber,
                totalPrice: grp.totalPrice,
                extraCost: grp.extraCost,
                remark: grp.remark ?? "",
                vendorName: grp.LRs[0].tvendor.name,
                LRs: (grp.LRs || []).map((l: any) => ({
                    id: l.id,
                    LRNumber: l.LRNumber,
                    vehicleNo: l.vehicleNo,
                    vehicleType: l.vehicleType,
                    outDate: l.outDate,
                    lrPrice: l.lrPrice,
                    extraCost: l.extraCost,
                    podlink: l.podlink,
                    fileNumber: grp.fileNumber,
                    remark: l.remark,
                    isInvoiced: l.isInvoiced,
                    CustomerName: l.CustomerName,
                    origin: l.origin
                })),
            }))
            setGroups(g)
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to load annexure")
        } finally {
            setLoading(false)
        }
    }

    const handleFile = async (f: File | null) => {
        if (!f) return
        setFile(f)
        setProcessingFile(true)
        try {
            const ab = await f.arrayBuffer()
            const wb = XLSX.read(ab, { type: "array" })
            const ws = wb.Sheets[wb.SheetNames[0]]
            const rows = XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[]
            const lrNums: string[] = []
            for (const r of rows) {
                const v = r["LR Number"] ?? r["lrNumber"] ?? r["LRNumber"] ?? r["LR"] ?? ""
                if (v) lrNums.push(String(v).trim().toUpperCase())
            }
            if (!lrNums.length) {
                toast.error("No LR numbers found in file")
                setProcessingFile(false)
                return
            }
            setAddInput((prev) => (prev ? prev + "\n" + lrNums.join("\n") : lrNums.join("\n")))
            toast.success(`Parsed ${lrNums.length} LR numbers from file`)
        } catch (err: any) {
            console.error(err)
            toast.error("Failed to parse file")
        } finally {
            setProcessingFile(false)
        }
    }

    const handleAdd = async () => {
        const raw = addInput
            .split(/[\n,]+/)
            .map((s) => s.trim().toUpperCase())
            .filter(Boolean)
        if (!raw.length) return toast.error("Enter LR numbers or upload a file")

        try {
            setLoading(true)
            const res = await fetch(`/api/lorries/annexures/${id}/add-lrs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lrNumbers: raw, vendorId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Add failed")

            const issues: ValidationIssue[] = []

            if (data.duplicateInFile?.length) {
                data.duplicateInFile.forEach((lr: string) => {
                    issues.push({ lrNumber: lr, type: "duplicate_in_file", message: "Duplicate entry in this batch" })
                })
            }
            if (data.missingInDb?.length) {
                data.missingInDb.forEach((lr: string) => {
                    issues.push({ lrNumber: lr, type: "not_found", message: "Not found in database" })
                })
            }
            if (data.alreadyInvoiced?.length) {
                data.alreadyInvoiced.forEach((lr: string) => {
                    issues.push({ lrNumber: lr, type: "already_invoiced", message: "Already invoiced (cannot add)" })
                })
            }
            if (data.alreadyAnnexured?.length) {
                data.alreadyAnnexured.forEach((lr: string) => {
                    issues.push({ lrNumber: lr, type: "already_annexed", message: "Already linked to another annexure" })
                })
            }

            if (data.missingPod?.length) {
                data.missingPod.forEach((lr: string) => {
                    issues.push({ lrNumber: lr, type: "missing_pod", message: "POD not uploaded yet" })
                })
            }

            // Handle wrong vendor LRs
            if (data.wrongVendor?.length) {
                data.wrongVendor.forEach((lr: string) => {
                    issues.push({ lrNumber: lr, type: "wrong_vendor", message: "Wrong LR" })
                })
            }

            // Handle missing LRs per file
            if (data.missingLRsPerFile?.length) {
                data.missingLRsPerFile.forEach((file: { fileNumber: string; missing: string[]; total: number; added: number }) => {
                    file.missing.forEach(lr => {
                        issues.push({
                            lrNumber: lr,
                            type: "missing_in_file",
                            message: `Missing from ${file.fileNumber} (${file.added}/${file.total} added)`
                        })
                    })
                })
            }

            if (issues.length > 0) {
                setValidationIssues(issues)
                setShowValidationDialog(true)
            }

            const msgs: string[] = []
            if (data.added?.length) msgs.push(`✓ Added ${data.added.length} LR(s)`)
            if (data.createdGroups?.length) msgs.push(`✓ Created ${data.createdGroups.length} group(s)`)
            if (issues.length > 0) msgs.push(`⚠ ${issues.length} issue(s) - see details below`)

            toast.success(msgs.join(" • "), { duration: 4000 })
            setAddInput("")
            setFile(null)
            fetchAnnexure()
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to add LRs")
        } finally {
            setLoading(false)
        }
    }

    //   const handleRemoveLr = async (lrNumber: string) => {
    //     try {
    //       const res = await fetch(`/api/lorries/annexures/${id}/remove-lr`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ lrNumber }),
    //       })
    //       const data = await res.json()
    //       if (!res.ok) throw new Error(data.error || "Remove failed")

    //       if (data.requiresConfirmation) {
    //         const ok = confirm(
    //           `Removing LR ${lrNumber} will remove ${data.affectedCount} LR(s) belonging to file ${data.fileNumber}. Continue?`
    //         )
    //         if (!ok) return
    //         const res2 = await fetch(`/api/lorries/annexures/${id}/remove-lr`, {
    //           method: "POST",
    //           headers: { "Content-Type": "application/json" },
    //           body: JSON.stringify({ lrNumber, confirmFileRemoval: true }),
    //         })
    //         const d2 = await res2.json()
    //         if (!res2.ok) throw new Error(d2.error || "Remove failed")
    //         toast.success(`${d2.removedCount} LR(s) removed from annexure`)
    //       } else {
    //         toast.success("LR removed")
    //       }
    //       fetchAnnexure()
    //     } catch (err: any) {
    //       console.error(err)
    //       toast.error(err.message || "Failed to remove LR")
    //     }
    //   }

    const handleDeleteGroup = async (groupId: string) => {
        if (!confirm("Delete this file group and unlink all its LRs from annexure?")) return
        try {
            setLoading(true)
            const res = await fetch(`/api/lorries/annexures/groups/${groupId}`, { method: "DELETE" })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Delete failed")
            toast.success(`Group deleted. ${data.unlinkedCount} LRs unlinked`)
            fetchAnnexure()
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to delete group")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveGroups = async () => {
        try {
            setLoading(true)
            const payload = {
                groups: groups.map((g) => ({
                    groupId: g.id,
                    remark: g.remark ?? "",
                    extraCost: Number(g.extraCost ?? 0),
                })),
            }
            const res = await fetch(`/api/lorries/annexures/${id}/save-edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Save failed")
            toast.success("Annexure saved successfully")
            fetchAnnexure()
            router.push(`/lorries/annexure/${id}`)
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to save")
        } finally {
            setLoading(false)
        }
    }

    const getLRStatus = (lr: LR) => {
        if (lr.isInvoiced) return { status: "invoiced", message: "Invoiced" }
        if (!lr.podlink) return { status: "pod_missing", message: "POD Missing" }

        return { status: "pod_present", message: "POD Uploaded" }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-pretty">Edit Annexure — {annexureName}</h2>
                <div className="flex gap-2">
                    <Button onClick={() => router.push("/lorries/annexure")} variant="outline">
                        Back
                    </Button>
                    <Button onClick={handleSaveGroups} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" /> Save Annexure
                    </Button>
                </div>
            </div>

            <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Add LRs to Annexure</h3>
                    <p className="text-sm text-muted-foreground">Upload a CSV/XLSX file or enter LR numbers manually. All validations will be checked automatically.</p>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                            className="flex-1"
                        />
                        <Button onClick={() => handleFile(file)} disabled={!file || processingFile} variant="secondary">
                            <FilePlus className="w-4 h-4 mr-2" /> Parse File
                        </Button>
                    </div>

                    <div>
                        <textarea
                            className="w-full p-3 border rounded-md bg-background text-foreground font-mono text-sm"
                            rows={4}
                            placeholder="Paste LR numbers here (one per line or comma-separated)..."
                            value={addInput}
                            onChange={(e) => setAddInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleAdd} disabled={loading || processingFile} className="flex-1">
                            <Plus className="w-4 h-4 mr-2" /> Add LRs to Annexure
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setAddInput("")
                                setFile(null)
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            </div>

            <ValidationIssuesDialog open={showValidationDialog} onOpenChange={setShowValidationDialog} issues={validationIssues} />

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-card">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                        <p className="text-sm text-muted-foreground">Loading annexure LRs...</p>
                    </div>
                ) : groups.length === 0 ? (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>No LRs added yet. Start by uploading a file or adding LR numbers above.</AlertDescription>
                    </Alert>
                ) : (
                    groups.map((g) => (
                        <div key={g.id} className="border rounded-lg p-4 space-y-4 bg-card">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">File: {g.fileNumber}</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                        <span>LRs: {g.LRs.length}</span>
                                        <span>Total Freight: ₹{(g.totalPrice ?? 0).toLocaleString()}</span>
                                        <span>Extra per LR: ₹{(g.extraCost ?? 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <ExtraCostManager
                                    fileNumber={g.fileNumber}
                                    totalExtra={g.extraCost ? `₹${g.extraCost.toLocaleString()}` : ""}
                                    onSuccess={fetchAnnexure}
                                />

                                <Button variant="destructive" size="sm" onClick={() => handleDeleteGroup(g.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>


                            </div>

                            {/* <div className="space-y-3 border-t pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium">Remarks</label>
                                        <Input
                                            value={g.remark ?? ""}
                                            onChange={(e) =>
                                                setGroups((prev) =>
                                                    prev.map((p) => (p.id === g.id ? { ...p, remark: e.target.value } : p))
                                                )
                                            }
                                            placeholder="Add remarks for this file group..."
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Extra Cost per LR</label>
                                        <Input
                                            type="number"
                                            value={g.extraCost ?? ""}
                                            onChange={(e) =>
                                                setGroups((prev) =>
                                                    prev.map((p) =>
                                                        p.id === g.id ? { ...p, extraCost: e.target.value ? Number(e.target.value) : undefined } : p
                                                    )
                                                )
                                            }
                                            placeholder="0"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div> */}

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>LR Number</TableHead>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Out Date</TableHead>
                                            <TableHead>Freight</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>POD</TableHead>
                                            <TableHead className="w-12">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {g.LRs.map((lr) => {
                                            const status = getLRStatus(lr)
                                            return (
                                                <TableRow key={lr.id}>
                                                    <TableCell className="font-medium">{lr.LRNumber}</TableCell>
                                                    <TableCell className="text-sm">
                                                        {lr.vehicleNo ? `${lr.vehicleNo} • ${lr.vehicleType}` : "-"}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {lr.outDate ? new Date(lr.outDate).toLocaleDateString() : "-"}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        <form
                                                            onSubmit={async (e) => {
                                                                e.preventDefault();

                                                                const form = e.currentTarget;
                                                                const input = form.querySelector("input");
                                                                const rawValue = input?.value ?? "0";
                                                                const lrPrice = Number(rawValue.replace(/,/g, ""));

                                                                if (form.dataset.submitting === "true") return;
                                                                form.dataset.submitting = "true";
                                                                if (lr.lrPrice === lrPrice) {
                                                                    return
                                                                }
                                                                try {
                                                                    await setLrPrice({
                                                                        lrNumber: lr.LRNumber as any,
                                                                        lrPrice,
                                                                    });

                                                                    toast.success(`Price for LR ${lr.LRNumber} updated successfully.`);
                                                                    fetchAnnexure();
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    toast.error(`Failed to update price for LR ${lr.LRNumber}.`);
                                                                } finally {
                                                                    form.dataset.submitting = "false";
                                                                }
                                                            }}
                                                        >
                                                            <Label htmlFor={`${lr.LRNumber}-limit`} className="sr-only">
                                                                Freight
                                                            </Label>

                                                            <Input
                                                                id={`${lr.LRNumber}-limit`}
                                                                name="lrPrice"
                                                                defaultValue={(lr.lrPrice || 0).toLocaleString()}
                                                                onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                                                                className="hover:bg-input/30 focus-visible:bg-background 
                                                                    h-8 w-24 border-transparent bg-primary/10 border text-right 
                                                                    shadow-none focus-visible:border "
                                                            />
                                                        </form>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={status.status} message={status.message} />
                                                    </TableCell>
                                                    <TableCell>

                                                        <UploadPod
                                                            LrNumber={lr.LRNumber}
                                                            customer={lr.CustomerName}
                                                            fileNumber={lr.fileNumber!}
                                                            initialFileUrl={lr.podlink || null}
                                                            vendor={groups[0].vendorName || ""}
                                                            whId={lr.origin}

                                                        />


                                                    </TableCell>

                                                    <TableCell>

                                                        -

                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
