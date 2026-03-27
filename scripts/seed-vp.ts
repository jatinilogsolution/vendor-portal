// scripts/seed-vp.ts
import "dotenv/config"
// Run: npx tsx scripts/seed-vp.ts
// ─────────────────────────────────────────────────────────────────────────────
// Seeds the vendor portal with realistic dummy data for AWL India.
// Users:
//   ADMIN  → testadmin@awlindia.com
//   BOSS   → jatin.sharma@ilogsolution.com
//   VENDOR → desklap@gmail.com      (IT vendor)
//   VENDOR → jiya@awlinda.com       (Standard logistics vendor)
// ─────────────────────────────────────────────────────────────────────────────

import { prisma } from "../src/lib/prisma";
import argon2 from "argon2"



// ── helpers ───────────────────────────────────────────────────────────────────

const hash = (pw: string) => argon2.hash(pw)
const uid = () => crypto.randomUUID()

function daysAgo(n: number) {
    return new Date(Date.now() - n * 86_400_000)
}
function daysFromNow(n: number) {
    return new Date(Date.now() + n * 86_400_000)
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
    console.log("🌱  Starting vendor portal seed…\n")

    // ── 0. Clear existing VP data (in safe order) ────────────────────────────

    console.log("🗑   Clearing existing VP data…")

    // await prisma.vpAuditLog.deleteMany().catch(() => { })
    await prisma.vpNotification.deleteMany()
    await prisma.vpPayment.deleteMany()
    await prisma.vpInvoiceDocument.deleteMany()
    await prisma.vpInvoiceLineItem.deleteMany()
    await prisma.vpInvoice.deleteMany()
    await prisma.vpDeliveryItem.deleteMany()
    await prisma.vpDeliveryRecord.deleteMany()
    await prisma.vpPoLineItem.deleteMany()
    await prisma.vpPurchaseOrder.deleteMany()
    await prisma.vpPiLineItem.deleteMany()
    await prisma.vpProformaInvoice.deleteMany()
    await prisma.vpVendor.deleteMany()
    await prisma.vpItem.deleteMany()
    await prisma.vpCategory.deleteMany()
    await prisma.vpSettings.deleteMany()

    // Also clear the users we're about to seed (if re-running)
    const seedEmails = [
        "testadmin@awlindia.com",
        "jatin.sharma@ilogsolution.com",
        "desklap@gmail.com",
        "jiya@awlinda.com",
    ]
    for (const email of seedEmails) {
        const u = await prisma.user.findUnique({ where: { email } })
        if (u) {
            await prisma.session.deleteMany({ where: { userId: u.id } })
            await prisma.account.deleteMany({ where: { userId: u.id } })
            await prisma.log.deleteMany({ where: { userId: u.id } })
            await prisma.user.delete({ where: { id: u.id } })
        }
    }
    // Clear seed vendors from core table
    await prisma.vendor.deleteMany({
        where: {
            name: {
                in: [
                    "iLog Solutions Pvt. Ltd.",
                    "DeskLap Technologies",
                    "Jiya Logistics",
                ],
            },
        },
    })

    console.log("✅  Cleared\n")

    // ── 1. USERS ─────────────────────────────────────────────────────────────

    console.log("👤  Creating users…")

    const pw = await hash("Password@123")

    const adminUser = await prisma.user.create({
        data: {
            id: uid(),
            name: "Admin AWL",
            email: "testadmin@awlindia.com",
            role: "ADMIN",
            emailVerified: true,
            createdAt: daysAgo(60),
            updatedAt: daysAgo(1),
        },
    })

    const bossUser = await prisma.user.create({
        data: {
            id: uid(),
            name: "Jatin Sharma",
            email: "jatin.sharma@ilogsolution.com",
            role: "BOSS",
            emailVerified: true,
            createdAt: daysAgo(60),
            updatedAt: daysAgo(1),
        },
    })

    // Create accounts (better-auth credential accounts) for both
    for (const u of [adminUser, bossUser]) {
        await prisma.account.create({
            data: {
                id: uid(),
                accountId: u.id,
                providerId: "credential",
                password: pw,
                userId: u.id,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            },
        })
    }

    console.log("  ✅  Admin:", adminUser.email)
    console.log("  ✅  Boss: ", bossUser.email)

    // ── 2. CORE VENDORS ───────────────────────────────────────────────────────

    console.log("\n🏢  Creating core vendors…")

    // iLog Solutions – IT type (boss's company as a vendor too)
    const coreVendorIT = await prisma.vendor.create({
        data: {
            id: uid(),
            name: "iLog Solutions Pvt. Ltd.",
            contactEmail: "procurement@ilogsolution.com",
            contactPhone: "+91-9876543210",
            gstNumber: "27AABCI1234F1Z5",
            panNumber: "AABCI1234F",
            paymentTerms: "Net 30",
            profileCompleted: true,
            isActive: true,
            createdAt: daysAgo(90),
        },
    })

    await prisma.address.create({
        data: {
            id: uid(),
            line1: "Plot 12, IT Park",
            line2: "Sector 62",
            city: "Noida",
            state: "Uttar Pradesh",
            postal: "201309",
            country: "India",
            vendorId: coreVendorIT.id,
        },
    })

    // DeskLap Technologies – IT type
    const coreVendorDeskLap = await prisma.vendor.create({
        data: {
            id: uid(),
            name: "DeskLap Technologies",
            contactEmail: "desklap@gmail.com",
            contactPhone: "+91-9123456780",
            gstNumber: "07AACCD5678G1Z2",
            panNumber: "AACCD5678G",
            paymentTerms: "Net 15",
            profileCompleted: true,
            isActive: true,
            createdAt: daysAgo(80),
        },
    })

    await prisma.address.create({
        data: {
            id: uid(),
            line1: "B-201, Tech Hub",
            city: "Gurugram",
            state: "Haryana",
            postal: "122001",
            country: "India",
            vendorId: coreVendorDeskLap.id,
        },
    })

    // Jiya Logistics – Standard type
    const coreVendorJiya = await prisma.vendor.create({
        data: {
            id: uid(),
            name: "Jiya Logistics",
            contactEmail: "jiya@awlinda.com",
            contactPhone: "+91-8765432109",
            gstNumber: "06BBBCJ9012H1Z8",
            panNumber: "BBBCJ9012H",
            paymentTerms: "Net 45",
            profileCompleted: true,
            isActive: true,
            createdAt: daysAgo(70),
        },
    })

    await prisma.address.create({
        data: {
            id: uid(),
            line1: "Warehouse Complex, NH-48",
            city: "Faridabad",
            state: "Haryana",
            postal: "121001",
            country: "India",
            vendorId: coreVendorJiya.id,
        },
    })

    console.log("  ✅  iLog Solutions, DeskLap Technologies, Jiya Logistics")

    // ── 3. VENDOR USERS ───────────────────────────────────────────────────────

    console.log("\n👤  Creating vendor users…")

    const deskLapUser = await prisma.user.create({
        data: {
            id: uid(),
            name: "DeskLap Procurement",
            email: "desklap@gmail.com",
            role: "VENDOR",
            emailVerified: true,
            vendorId: coreVendorDeskLap.id,
            createdAt: daysAgo(78),
            updatedAt: daysAgo(2),
        },
    })

    const jiyaUser = await prisma.user.create({
        data: {
            id: uid(),
            name: "Jiya Sharma",
            email: "jiya@awlinda.com",
            role: "VENDOR",
            emailVerified: true,
            vendorId: coreVendorJiya.id,
            createdAt: daysAgo(68),
            updatedAt: daysAgo(1),
        },
    })

    for (const u of [deskLapUser, jiyaUser]) {
        await prisma.account.create({
            data: {
                id: uid(),
                accountId: u.id,
                providerId: "credential",
                password: pw,
                userId: u.id,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            },
        })
    }

    console.log("  ✅  desklap@gmail.com, jiya@awlinda.com")

    // ── 4. VP CATEGORIES ─────────────────────────────────────────────────────

    console.log("\n📁  Creating VP categories…")

    const catIT = await prisma.vpCategory.create({
        data: {
            id: uid(), name: "IT Services", code: "IT",
            status: "ACTIVE",
        },
    })

    const catITHardware = await prisma.vpCategory.create({
        data: {
            id: uid(), name: "Hardware", code: "IT-HW",
            status: "ACTIVE", parentId: catIT.id,
        },
    })

    const catITSoftware = await prisma.vpCategory.create({
        data: {
            id: uid(), name: "Software & Licenses", code: "IT-SW",
            status: "ACTIVE", parentId: catIT.id,
        },
    })

    const catITSupport = await prisma.vpCategory.create({
        data: {
            id: uid(), name: "IT Support & AMC", code: "IT-AMC",
            status: "ACTIVE", parentId: catIT.id,
        },
    })

    const catOps = await prisma.vpCategory.create({
        data: {
            id: uid(), name: "Operations", code: "OPS",
            status: "ACTIVE",
        },
    })

    const catLogistics = await prisma.vpCategory.create({
        data: {
            id: uid(), name: "Logistics & Transport", code: "OPS-LOG",
            status: "ACTIVE", parentId: catOps.id,
        },
    })

    const catFacilities = await prisma.vpCategory.create({
        data: {
            id: uid(), name: "Facilities", code: "OPS-FAC",
            status: "ACTIVE", parentId: catOps.id,
        },
    })

    console.log("  ✅  7 categories (IT tree + Operations tree)")

    // ── 5. VP ITEMS (Item Master) ─────────────────────────────────────────────

    console.log("\n📦  Creating item master…")

    const items = await Promise.all([
        // IT Hardware
        prisma.vpItem.create({ data: { id: uid(), code: "LAP-001", name: "Dell Latitude 5540 Laptop", uom: "PCS", defaultPrice: 68000, hsnCode: "8471", categoryId: catITHardware.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "LAP-002", name: "HP EliteBook 840 G10", uom: "PCS", defaultPrice: 72000, hsnCode: "8471", categoryId: catITHardware.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "MON-001", name: "Dell 24\" FHD Monitor P2422H", uom: "PCS", defaultPrice: 14500, hsnCode: "8528", categoryId: catITHardware.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "KEY-001", name: "Logitech MK470 Wireless Combo", uom: "PCS", defaultPrice: 2800, hsnCode: "8471", categoryId: catITHardware.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "SWT-001", name: "TP-Link 24-Port Gigabit Switch", uom: "PCS", defaultPrice: 9200, hsnCode: "8517", categoryId: catITHardware.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "UPS-001", name: "APC Back-UPS 1100VA", uom: "PCS", defaultPrice: 7500, hsnCode: "8504", categoryId: catITHardware.id } }),

        // IT Software
        prisma.vpItem.create({ data: { id: uid(), code: "LIC-001", name: "Microsoft 365 Business Basic (Annual)", uom: "LIC", defaultPrice: 8400, hsnCode: "9983", categoryId: catITSoftware.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "LIC-002", name: "Adobe Acrobat Pro DC (Annual)", uom: "LIC", defaultPrice: 18500, hsnCode: "9983", categoryId: catITSoftware.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "LIC-003", name: "Antivirus – Quick Heal (1 Year)", uom: "LIC", defaultPrice: 1200, hsnCode: "9983", categoryId: catITSoftware.id } }),

        // IT Support
        prisma.vpItem.create({ data: { id: uid(), code: "AMC-001", name: "Annual Maintenance Contract – Server", uom: "SET", defaultPrice: 45000, hsnCode: "9987", categoryId: catITSupport.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "AMC-002", name: "On-Site Support (Per Visit)", uom: "HRS", defaultPrice: 1500, hsnCode: "9987", categoryId: catITSupport.id } }),

        // Logistics
        prisma.vpItem.create({ data: { id: uid(), code: "LOG-001", name: "Full Truck Load (FTL) – 20 Tonne", uom: "TRIP", defaultPrice: 22000, hsnCode: "9965", categoryId: catLogistics.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "LOG-002", name: "Part Truck Load (PTL) per KG", uom: "KG", defaultPrice: 18, hsnCode: "9965", categoryId: catLogistics.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "LOG-003", name: "Warehousing (per Pallet/Month)", uom: "MTH", defaultPrice: 1200, hsnCode: "9967", categoryId: catLogistics.id } }),
        prisma.vpItem.create({ data: { id: uid(), code: "LOG-004", name: "Last-Mile Delivery (per Shipment)", uom: "SHP", defaultPrice: 350, hsnCode: "9965", categoryId: catLogistics.id } }),
    ])

    const [lapDell, lapHP, monitor, keyboard, netSwitch, ups,
        lic365, licAdobe, licAV, amc, support,
        ftl, ptl, warehouse, lastMile] = items

    console.log("  ✅  15 items across 4 sub-categories")

    // ── 6. VP VENDORS ─────────────────────────────────────────────────────────

    console.log("\n🏭  Enrolling VP vendors…")

    const vpVendorIT = await prisma.vpVendor.create({
        data: {
            id: uid(),
            existingVendorId: coreVendorDeskLap.id,
            categoryId: catITHardware.id,
            portalStatus: "ACTIVE",
            vendorType: "IT",
            billingType: "ONE_TIME",
            createdById: adminUser.id,
            createdAt: daysAgo(75),
            updatedAt: daysAgo(1),
        },
    })

    const vpVendorITSvc = await prisma.vpVendor.create({
        data: {
            id: uid(),
            existingVendorId: coreVendorIT.id,
            categoryId: catITSupport.id,
            portalStatus: "ACTIVE",
            vendorType: "IT",
            billingType: "RECURRING",
            recurringCycle: "MONTHLY",
            createdById: adminUser.id,
            createdAt: daysAgo(75),
            updatedAt: daysAgo(1),
        },
    })

    const vpVendorLog = await prisma.vpVendor.create({
        data: {
            id: uid(),
            existingVendorId: coreVendorJiya.id,
            categoryId: catLogistics.id,
            portalStatus: "ACTIVE",
            vendorType: "STANDARD",
            billingType: "RECURRING",
            recurringCycle: "MONTHLY",
            createdById: adminUser.id,
            createdAt: daysAgo(65),
            updatedAt: daysAgo(1),
        },
    })

    // Link vendor users to their vpVendor via existing vendor
    // (already done via vendorId on User → Vendor → VpVendor chain)

    console.log("  ✅  3 VP vendors enrolled")

    // ── 7. VP PURCHASE ORDERS ─────────────────────────────────────────────────

    console.log("\n🛒  Creating purchase orders…")

    // PO 1 — IT Hardware (DeskLap) — CLOSED (fully delivered)
    const po1Items = [
        { item: lapDell, qty: 5, price: 68000 },
        { item: monitor, qty: 5, price: 14500 },
        { item: keyboard, qty: 5, price: 2800 },
    ]
    const po1Sub = po1Items.reduce((s, i) => s + i.qty * i.price, 0)
    const po1Tax = po1Sub * 0.18
    const po1Grand = po1Sub + po1Tax

    const po1 = await prisma.vpPurchaseOrder.create({
        data: {
            id: uid(),
            poNumber: "VP-PO-2503-0001",
            status: "ACKNOWLEDGED",
            vendorId: vpVendorIT.id,
            categoryId: catITHardware.id,
            subtotal: po1Sub,
            taxRate: 18,
            taxAmount: po1Tax,
            grandTotal: po1Grand,
            notes: "Q1 laptop refresh for operations team – Faridabad DC",
            deliveryDate: daysAgo(20),
            deliveryAddress: "AWL India – Faridabad Distribution Centre, Sector 24, Faridabad 121004",
            createdById: adminUser.id,
            approvedById: bossUser.id,
            submittedAt: daysAgo(50),
            approvedAt: daysAgo(47),
            sentToVendorAt: daysAgo(46),
            acknowledgedAt: daysAgo(44),
            createdAt: daysAgo(52),
            updatedAt: daysAgo(20),
            items: {
                create: po1Items.map((i) => ({
                    id: uid(),
                    itemId: i.item.id,
                    description: i.item.name,
                    qty: i.qty,
                    unitPrice: i.price,
                    total: i.qty * i.price,
                })),
            },
        },
        include: { items: true },
    })

    // PO 2 — Networking gear (DeskLap) — APPROVED (not yet sent)
    const po2Items = [
        { item: netSwitch, qty: 3, price: 9200 },
        { item: ups, qty: 6, price: 7500 },
    ]
    const po2Sub = po2Items.reduce((s, i) => s + i.qty * i.price, 0)
    const po2Tax = po2Sub * 0.18
    const po2Grand = po2Sub + po2Tax

    const po2 = await prisma.vpPurchaseOrder.create({
        data: {
            id: uid(),
            poNumber: "VP-PO-2503-0002",
            status: "APPROVED",
            vendorId: vpVendorIT.id,
            categoryId: catITHardware.id,
            subtotal: po2Sub,
            taxRate: 18,
            taxAmount: po2Tax,
            grandTotal: po2Grand,
            notes: "Network upgrade – Gurugram office",
            deliveryDate: daysFromNow(14),
            deliveryAddress: "AWL India – Gurugram Office, DLF Phase 2, Gurugram 122002",
            createdById: adminUser.id,
            approvedById: bossUser.id,
            submittedAt: daysAgo(8),
            approvedAt: daysAgo(5),
            createdAt: daysAgo(10),
            updatedAt: daysAgo(5),
            items: {
                create: po2Items.map((i) => ({
                    id: uid(),
                    itemId: i.item.id,
                    description: i.item.name,
                    qty: i.qty,
                    unitPrice: i.price,
                    total: i.qty * i.price,
                })),
            },
        },
        include: { items: true },
    })

    // PO 3 — Logistics (Jiya) — SUBMITTED (awaiting boss approval)
    const po3Items = [
        { item: ftl, qty: 12, price: 22000 },
        { item: warehouse, qty: 20, price: 1200 },
    ]
    const po3Sub = po3Items.reduce((s, i) => s + i.qty * i.price, 0)
    const po3Tax = po3Sub * 0.05
    const po3Grand = po3Sub + po3Tax

    const po3 = await prisma.vpPurchaseOrder.create({
        data: {
            id: uid(),
            poNumber: "VP-PO-2503-0003",
            status: "SUBMITTED",
            vendorId: vpVendorLog.id,
            categoryId: catLogistics.id,
            subtotal: po3Sub,
            taxRate: 5,
            taxAmount: po3Tax,
            grandTotal: po3Grand,
            notes: "Monthly logistics contract – April 2025. FTL routes: Faridabad–Mumbai, Faridabad–Ahmedabad.",
            deliveryDate: daysFromNow(5),
            deliveryAddress: "As per route plan shared separately",
            createdById: adminUser.id,
            submittedAt: daysAgo(1),
            createdAt: daysAgo(2),
            updatedAt: daysAgo(1),
            items: {
                create: po3Items.map((i) => ({
                    id: uid(),
                    itemId: i.item.id,
                    description: i.item.name,
                    qty: i.qty,
                    unitPrice: i.price,
                    total: i.qty * i.price,
                })),
            },
        },
        include: { items: true },
    })

    // PO 4 — IT AMC (iLog) — DRAFT
    const po4Items = [
        { item: amc, qty: 1, price: 45000 },
        { item: support, qty: 20, price: 1500 },
    ]
    const po4Sub = po4Items.reduce((s, i) => s + i.qty * i.price, 0)
    const po4Tax = po4Sub * 0.18
    const po4Grand = po4Sub + po4Tax

    const po4 = await prisma.vpPurchaseOrder.create({
        data: {
            id: uid(),
            poNumber: "VP-PO-2503-0004",
            status: "DRAFT",
            vendorId: vpVendorITSvc.id,
            categoryId: catITSupport.id,
            subtotal: po4Sub,
            taxRate: 18,
            taxAmount: po4Tax,
            grandTotal: po4Grand,
            notes: "Annual server AMC + ad-hoc support blocks for FY 2025-26",
            createdById: adminUser.id,
            createdAt: daysAgo(1),
            updatedAt: daysAgo(1),
            items: {
                create: po4Items.map((i) => ({
                    id: uid(),
                    itemId: i.item.id,
                    description: i.item.name,
                    qty: i.qty,
                    unitPrice: i.price,
                    total: i.qty * i.price,
                })),
            },
        },
        include: { items: true },
    })

    console.log("  ✅  4 POs created (ACKNOWLEDGED, APPROVED, SUBMITTED, DRAFT)")

    // ── 8. VP PROFORMA INVOICES ───────────────────────────────────────────────

    console.log("\n📋  Creating proforma invoices…")

    // PI 1 — Laptops (DeskLap) — ACCEPTED and converted to PO (back-linked)
    const pi1Items = [
        { item: lapHP, qty: 8, price: 72000 },
        { item: monitor, qty: 8, price: 14500 },
    ]
    const pi1Sub = pi1Items.reduce((s, i) => s + i.qty * i.price, 0)
    const pi1Tax = pi1Sub * 0.18
    const pi1Grand = pi1Sub + pi1Tax

    const pi1 = await prisma.vpProformaInvoice.create({
        data: {
            id: uid(),
            piNumber: "VP-PI-2502-0001",
            status: "ACCEPTED",
            vendorId: vpVendorIT.id,
            categoryId: catITHardware.id,
            subtotal: pi1Sub,
            taxRate: 18,
            taxAmount: pi1Tax,
            grandTotal: pi1Grand,
            notes: "Proforma for Q2 laptop procurement. Validity: 30 days.",
            validityDate: daysFromNow(10),
            paymentTerms: "50% advance on PO, 50% on delivery",
            createdById: adminUser.id,
            approvedById: bossUser.id,
            submittedAt: daysAgo(30),
            approvedAt: daysAgo(28),
            sentToVendorAt: daysAgo(27),
            acceptedAt: daysAgo(25),
            convertedToPoId: po1.id,
            createdAt: daysAgo(32),
            updatedAt: daysAgo(25),
            items: {
                create: pi1Items.map((i) => ({
                    id: uid(),
                    itemId: i.item.id,
                    description: i.item.name,
                    qty: i.qty,
                    unitPrice: i.price,
                    total: i.qty * i.price,
                })),
            },
        },
    })

    // PI 2 — Software licenses (DeskLap) — SUBMITTED (boss to approve)
    const pi2Items = [
        { item: lic365, qty: 25, price: 8400 },
        { item: licAdobe, qty: 10, price: 18500 },
        { item: licAV, qty: 25, price: 1200 },
    ]
    const pi2Sub = pi2Items.reduce((s, i) => s + i.qty * i.price, 0)
    const pi2Tax = pi2Sub * 0.18
    const pi2Grand = pi2Sub + pi2Tax

    const pi2 = await prisma.vpProformaInvoice.create({
        data: {
            id: uid(),
            piNumber: "VP-PI-2503-0002",
            status: "SUBMITTED",
            vendorId: vpVendorIT.id,
            categoryId: catITSoftware.id,
            subtotal: pi2Sub,
            taxRate: 18,
            taxAmount: pi2Tax,
            grandTotal: pi2Grand,
            notes: "Annual software licence renewal for AWL India HO and DC staff.",
            validityDate: daysFromNow(20),
            paymentTerms: "100% on invoice, Net 15",
            createdById: adminUser.id,
            submittedAt: daysAgo(2),
            createdAt: daysAgo(3),
            updatedAt: daysAgo(2),
            items: {
                create: pi2Items.map((i) => ({
                    id: uid(),
                    itemId: i.item.id,
                    description: i.item.name,
                    qty: i.qty,
                    unitPrice: i.price,
                    total: i.qty * i.price,
                })),
            },
        },
    })

    // PI 3 — Logistics (Jiya) — DRAFT
    const pi3Items = [
        { item: lastMile, qty: 500, price: 350 },
        { item: warehouse, qty: 30, price: 1200 },
    ]
    const pi3Sub = pi3Items.reduce((s, i) => s + i.qty * i.price, 0)
    const pi3Tax = pi3Sub * 0.05
    const pi3Grand = pi3Sub + pi3Tax

    const pi3 = await prisma.vpProformaInvoice.create({
        data: {
            id: uid(),
            piNumber: "VP-PI-2503-0003",
            status: "DRAFT",
            vendorId: vpVendorLog.id,
            categoryId: catLogistics.id,
            subtotal: pi3Sub,
            taxRate: 5,
            taxAmount: pi3Tax,
            grandTotal: pi3Grand,
            notes: "Proforma for last-mile + warehousing – Q2 2025",
            validityDate: daysFromNow(30),
            paymentTerms: "Net 30",
            createdById: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: {
                create: pi3Items.map((i) => ({
                    id: uid(),
                    itemId: i.item.id,
                    description: i.item.name,
                    qty: i.qty,
                    unitPrice: i.price,
                    total: i.qty * i.price,
                })),
            },
        },
    })

    console.log("  ✅  3 PIs created (ACCEPTED, SUBMITTED, DRAFT)")

    // ── 9. VP INVOICES ────────────────────────────────────────────────────────

    console.log("\n🧾  Creating vendor invoices…")

    // Invoice 1 — DeskLap hardware bill — PAYMENT_CONFIRMED (fully paid)
    const inv1Items = [
        { desc: "Dell Latitude 5540 Laptop x5", qty: 5, unit: 68000, tax: 18 },
        { desc: "Dell 24\" Monitor P2422H x5", qty: 5, unit: 14500, tax: 18 },
        { desc: "Logitech MK470 Wireless Combo x5", qty: 5, unit: 2800, tax: 18 },
    ]
    const inv1Sub = inv1Items.reduce((s, i) => s + i.qty * i.unit, 0)
    const inv1Tax = inv1Sub * 0.18
    const inv1Total = inv1Sub + inv1Tax

    const invoice1 = await prisma.vpInvoice.create({
        data: {
            id: uid(),
            invoiceNumber: "DL/2025/0089",
            status: "PAYMENT_CONFIRMED",
            type: "DIGITAL",
            vendorId: vpVendorIT.id,
            poId: po1.id,
            subtotal: inv1Sub,
            taxRate: 18,
            taxAmount: inv1Tax,
            totalAmount: inv1Total,
            notes: "Hardware supply as per PO VP-PO-2503-0001. IGST @ 18%.",
            createdById: deskLapUser.id,
            reviewedById: adminUser.id,
            submittedAt: daysAgo(22),
            approvedAt: daysAgo(18),
            createdAt: daysAgo(24),
            updatedAt: daysAgo(10),
            lineItems: {
                create: inv1Items.map((i) => ({
                    id: uid(),
                    description: i.desc,
                    qty: i.qty,
                    unitPrice: i.unit,
                    tax: i.tax,
                    total: i.qty * i.unit,
                })),
            },
        },
    })

    // Invoice 2 — Jiya logistics monthly bill — APPROVED (payment pending)
    const inv2Items = [
        { desc: "FTL Transport March 2025 – 10 Trips", qty: 10, unit: 22000, tax: 5 },
        { desc: "Warehousing – March 2025 – 15 Pallets", qty: 15, unit: 1200, tax: 5 },
    ]
    const inv2Sub = inv2Items.reduce((s, i) => s + i.qty * i.unit, 0)
    const inv2Tax = inv2Sub * 0.05
    const inv2Total = inv2Sub + inv2Tax

    const invoice2 = await prisma.vpInvoice.create({
        data: {
            id: uid(),
            invoiceNumber: "JL/MAR25/014",
            status: "APPROVED",
            type: "PDF",
            vendorId: vpVendorLog.id,
            poId: po1.id, // loosely linked
            subtotal: inv2Sub,
            taxRate: 5,
            taxAmount: inv2Tax,
            totalAmount: inv2Total,
            notes: "Monthly logistics bill for March 2025. CGST+SGST @ 2.5% each.",
            createdById: jiyaUser.id,
            reviewedById: adminUser.id,
            submittedAt: daysAgo(14),
            approvedAt: daysAgo(9),
            createdAt: daysAgo(16),
            updatedAt: daysAgo(9),
            lineItems: {
                create: inv2Items.map((i) => ({
                    id: uid(),
                    description: i.desc,
                    qty: i.qty,
                    unitPrice: i.unit,
                    tax: i.tax,
                    total: i.qty * i.unit,
                })),
            },
        },
    })

    // Invoice 3 — DeskLap software invoice — UNDER_REVIEW
    const inv3Items = [
        { desc: "Microsoft 365 Business Basic – 25 licenses (1 year)", qty: 25, unit: 8400, tax: 18 },
        { desc: "Quick Heal Antivirus – 25 licenses (1 year)", qty: 25, unit: 1200, tax: 18 },
    ]
    const inv3Sub = inv3Items.reduce((s, i) => s + i.qty * i.unit, 0)
    const inv3Tax = inv3Sub * 0.18
    const inv3Total = inv3Sub + inv3Tax

    const invoice3 = await prisma.vpInvoice.create({
        data: {
            id: uid(),
            invoiceNumber: "DL/2025/0094",
            status: "UNDER_REVIEW",
            type: "DIGITAL",
            vendorId: vpVendorIT.id,
            piId: pi1.id,
            subtotal: inv3Sub,
            taxRate: 18,
            taxAmount: inv3Tax,
            totalAmount: inv3Total,
            notes: "Software licence renewal as quoted in PI VP-PI-2502-0001.",
            createdById: deskLapUser.id,
            reviewedById: adminUser.id,
            submittedAt: daysAgo(5),
            createdAt: daysAgo(6),
            updatedAt: daysAgo(4),
            lineItems: {
                create: inv3Items.map((i) => ({
                    id: uid(),
                    description: i.desc,
                    qty: i.qty,
                    unitPrice: i.unit,
                    tax: i.tax,
                    total: i.qty * i.unit,
                })),
            },
        },
    })

    // Invoice 4 — Jiya April recurring — SUBMITTED
    const inv4Items = [
        { desc: "Last-Mile Delivery – April 2025 (est. 200 shipments)", qty: 200, unit: 350, tax: 5 },
    ]
    const inv4Sub = inv4Items.reduce((s, i) => s + i.qty * i.unit, 0)
    const inv4Tax = inv4Sub * 0.05
    const inv4Total = inv4Sub + inv4Tax

    const invoice4 = await prisma.vpInvoice.create({
        data: {
            id: uid(),
            invoiceNumber: "JL/APR25/001",
            status: "SUBMITTED",
            type: "PDF",
            vendorId: vpVendorLog.id,
            subtotal: inv4Sub,
            taxRate: 5,
            taxAmount: inv4Tax,
            totalAmount: inv4Total,
            notes: "April 2025 advance billing for last-mile operations.",
            createdById: jiyaUser.id,
            submittedAt: daysAgo(1),
            createdAt: daysAgo(2),
            updatedAt: daysAgo(1),
            lineItems: {
                create: inv4Items.map((i) => ({
                    id: uid(),
                    description: i.desc,
                    qty: i.qty,
                    unitPrice: i.unit,
                    tax: i.tax,
                    total: i.qty * i.unit,
                })),
            },
        },
    })

    // Invoice 5 — DeskLap draft invoice
    const inv5Items = [
        { desc: "HP EliteBook 840 G10 – 3 units", qty: 3, unit: 72000, tax: 18 },
    ]
    const inv5Sub = inv5Items.reduce((s, i) => s + i.qty * i.unit, 0)
    const inv5Tax = inv5Sub * 0.18
    const inv5Total = inv5Sub + inv5Tax

    await prisma.vpInvoice.create({
        data: {
            id: uid(),
            invoiceNumber: "DL/2025/0097",
            status: "DRAFT",
            type: "DIGITAL",
            vendorId: vpVendorIT.id,
            subtotal: inv5Sub,
            taxRate: 18,
            taxAmount: inv5Tax,
            totalAmount: inv5Total,
            notes: "Draft – management laptop order",
            createdById: deskLapUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            lineItems: {
                create: inv5Items.map((i) => ({
                    id: uid(),
                    description: i.desc,
                    qty: i.qty,
                    unitPrice: i.unit,
                    tax: i.tax,
                    total: i.qty * i.unit,
                })),
            },
        },
    })

    console.log("  ✅  5 invoices (CONFIRMED, APPROVED, UNDER_REVIEW, SUBMITTED, DRAFT)")

    // ── 10. VP PAYMENTS ───────────────────────────────────────────────────────

    console.log("\n💳  Creating payments…")

    // Payment for invoice 1 (CONFIRMED)
    await prisma.vpPayment.create({
        data: {
            id: uid(),
            invoiceId: invoice1.id,
            amount: inv1Total,
            paymentMode: "NEFT",
            transactionRef: "NEFT25031800012345",
            paymentDate: daysAgo(10),
            status: "COMPLETED",
            initiatedById: bossUser.id,
            createdAt: daysAgo(12),
            updatedAt: daysAgo(10),
        },
    })

    // Payment for invoice 2 (INITIATED — awaiting confirmation)
    await prisma.vpPayment.create({
        data: {
            id: uid(),
            invoiceId: invoice2.id,
            amount: inv2Total,
            paymentMode: "RTGS",
            transactionRef: "RTGS25031400056789",
            paymentDate: daysAgo(7),
            status: "INITIATED",
            initiatedById: bossUser.id,
            createdAt: daysAgo(8),
            updatedAt: daysAgo(7),
        },
    })

    console.log("  ✅  2 payments (COMPLETED, INITIATED)")

    // ── 11. VP DELIVERIES ─────────────────────────────────────────────────────

    console.log("\n🚚  Creating delivery records…")

    // Delivery for PO1 — FULLY_DELIVERED
    const po1LineItems = await prisma.vpPoLineItem.findMany({
        where: { poId: po1.id },
    })

    await prisma.vpDeliveryRecord.create({
        data: {
            id: uid(),
            poId: po1.id,
            deliveryDate: daysAgo(20),
            dispatchedBy: "Rajesh Kumar (DeskLap Dispatch)",
            receivedBy: "Suresh Patel (AWL Store)",
            status: "APPROVED",
            notes: "All items received in good condition. Verified against PO VP-PO-2503-0001.",
            createdAt: daysAgo(20),
            updatedAt: daysAgo(18),
            items: {
                create: po1LineItems.map((li) => ({
                    id: uid(),
                    poLineItemId: li.id,
                    qtyDelivered: li.qty,
                    condition: "GOOD",
                })),
            },
        },
    })

    console.log("  ✅  1 delivery record (APPROVED for PO1)")

    // ── 12. VP NOTIFICATIONS ─────────────────────────────────────────────────

    console.log("\n🔔  Creating notifications…")

    const notifData = [
        // Admin notifications
        {
            userId: adminUser.id, type: "PO_APPROVED",
            message: "Purchase Order VP-PO-2503-0001 has been approved by Jatin Sharma. You can now send it to the vendor.",
            refDocType: "VpPurchaseOrder", refDocId: po1.id, isRead: true,
            createdAt: daysAgo(47),
        },
        {
            userId: adminUser.id, type: "INVOICE_SUBMITTED",
            message: "Vendor Invoice DL/2025/0089 has been submitted by DeskLap Technologies and is awaiting review.",
            refDocType: "VpInvoice", refDocId: invoice1.id, isRead: true,
            createdAt: daysAgo(22),
        },
        {
            userId: adminUser.id, type: "INVOICE_SUBMITTED",
            message: "Vendor Invoice JL/APR25/001 has been submitted by Jiya Logistics and is awaiting review.",
            refDocType: "VpInvoice", refDocId: invoice4.id, isRead: false,
            createdAt: daysAgo(1),
        },
        {
            userId: adminUser.id, type: "PO_ACKNOWLEDGED",
            message: "Purchase Order VP-PO-2503-0001 has been acknowledged by the vendor.",
            refDocType: "VpPurchaseOrder", refDocId: po1.id, isRead: true,
            createdAt: daysAgo(44),
        },
        // Boss notifications
        {
            userId: bossUser.id, type: "PO_SUBMITTED",
            message: "Purchase Order VP-PO-2503-0003 has been submitted for your approval.",
            refDocType: "VpPurchaseOrder", refDocId: po3.id, isRead: false,
            createdAt: daysAgo(1),
        },
        {
            userId: bossUser.id, type: "PI_SUBMITTED",
            message: "Proforma Invoice VP-PI-2503-0002 has been submitted for your approval.",
            refDocType: "VpProformaInvoice", refDocId: pi2.id, isRead: false,
            createdAt: daysAgo(2),
        },
        {
            userId: bossUser.id, type: "INVOICE_SUBMITTED",
            message: "Vendor Invoice DL/2025/0094 is under review and ready for your approval.",
            refDocType: "VpInvoice", refDocId: invoice3.id, isRead: false,
            createdAt: daysAgo(4),
        },
        {
            userId: bossUser.id, type: "PAYMENT_INITIATED",
            message: "Payment of ₹2,85,376 has been initiated for invoice JL/MAR25/014.",
            refDocType: "VpInvoice", refDocId: invoice2.id, isRead: true,
            createdAt: daysAgo(8),
        },
        // DeskLap vendor notifications
        {
            userId: deskLapUser.id, type: "PO_SENT_TO_VENDOR",
            message: "A new Purchase Order VP-PO-2503-0001 has been sent to you. Please review and acknowledge.",
            refDocType: "VpPurchaseOrder", refDocId: po1.id, isRead: true,
            createdAt: daysAgo(46),
        },
        {
            userId: deskLapUser.id, type: "INVOICE_APPROVED",
            message: "Your invoice DL/2025/0089 has been approved. Payment will be initiated shortly.",
            refDocType: "VpInvoice", refDocId: invoice1.id, isRead: true,
            createdAt: daysAgo(18),
        },
        {
            userId: deskLapUser.id, type: "PAYMENT_CONFIRMED",
            message: "Payment for invoice DL/2025/0089 has been confirmed. Amount: ₹4,94,550.",
            refDocType: "VpInvoice", refDocId: invoice1.id, isRead: true,
            createdAt: daysAgo(10),
        },
        {
            userId: deskLapUser.id, type: "PI_SENT_TO_VENDOR",
            message: "A Proforma Invoice VP-PI-2502-0001 has been sent to you for review.",
            refDocType: "VpProformaInvoice", refDocId: pi1.id, isRead: true,
            createdAt: daysAgo(27),
        },
        // Jiya vendor notifications
        {
            userId: jiyaUser.id, type: "INVOICE_APPROVED",
            message: "Your invoice JL/MAR25/014 has been approved. Payment will be initiated shortly.",
            refDocType: "VpInvoice", refDocId: invoice2.id, isRead: true,
            createdAt: daysAgo(9),
        },
        {
            userId: jiyaUser.id, type: "DELIVERY_CREATED",
            message: "A delivery record has been created for PO VP-PO-2503-0001 — status: APPROVED.",
            refDocType: "VpDeliveryRecord", refDocId: undefined, isRead: false,
            createdAt: daysAgo(20),
        },
        {
            userId: jiyaUser.id, type: "PAYMENT_INITIATED",
            message: "Payment of ₹2,85,376 has been initiated for invoice JL/MAR25/014.",
            refDocType: "VpInvoice", refDocId: invoice2.id, isRead: false,
            createdAt: daysAgo(7),
        },
    ]

    await prisma.vpNotification.createMany({
        data: notifData.map((n) => ({
            id: uid(),
            userId: n.userId,
            type: n.type,
            message: n.message,
            refDocType: n.refDocType ?? null,
            refDocId: n.refDocId ?? null,
            isRead: n.isRead,
            createdAt: n.createdAt,
            updatedAt: n.createdAt,
        })),
    })

    console.log("  ✅  15 notifications across all users")

    // ── 13. VP SETTINGS ───────────────────────────────────────────────────────

    console.log("\n⚙️   Seeding VP settings…")

    await prisma.vpSettings.createMany({
        data: [
            { id: uid(), category: "GENERAL", name: "portal_name", value: "AWL India Vendor Portal", description: "Display name shown in the portal header" },
            { id: uid(), category: "GENERAL", name: "company_name", value: "AWL India Pvt. Ltd.", description: "Your company name (appears on documents)" },
            { id: uid(), category: "GENERAL", name: "company_gstin", value: "06AAECA4234F1ZX", description: "AWL India GSTIN" },
            { id: uid(), category: "GENERAL", name: "company_address", value: "Plot 27, Sector 7, IMT Faridabad, Haryana 121004", description: "Registered office address" },
            { id: uid(), category: "APPROVAL", name: "po_auto_remind_days", value: "3", description: "Days before reminding BOSS to approve a PO" },
            { id: uid(), category: "APPROVAL", name: "invoice_auto_remind_days", value: "2", description: "Days before reminding admin to review an invoice" },
            { id: uid(), category: "PAYMENT", name: "default_payment_terms", value: "Net 30", description: "Default payment terms applied to all vendors unless overridden" },
            { id: uid(), category: "PAYMENT", name: "bank_account_name", value: "AWL India Pvt. Ltd.", description: "Bank account holder name" },
            { id: uid(), category: "PAYMENT", name: "bank_account_number", value: "XXXXXXXXXXXX1234", description: "Bank account number (masked)" },
            { id: uid(), category: "PAYMENT", name: "bank_ifsc", value: "HDFC0001234", description: "Bank IFSC code" },
            { id: uid(), category: "PAYMENT", name: "bank_name", value: "HDFC Bank, Faridabad Main Branch", description: "Bank name and branch" },
            { id: uid(), category: "EMAIL", name: "notify_on_invoice_submit", value: "true", description: "Email admins when a vendor submits a new invoice" },
            { id: uid(), category: "EMAIL", name: "notify_on_po_approve", value: "true", description: "Email vendor when their PO is approved" },
            { id: uid(), category: "EMAIL", name: "notify_on_payment_done", value: "true", description: "Email vendor when payment is confirmed" },
        ],
        // skipDuplicates: true,
    })

    console.log("  ✅  14 settings seeded")

    // ── 14. SUMMARY ───────────────────────────────────────────────────────────

    console.log("\n" + "=".repeat(60))
    console.log("🎉  SEED COMPLETE")
    console.log("=".repeat(60))

    console.log("\n📧  LOGIN CREDENTIALS (all passwords: Password@123)\n")

    const users = [
        { role: "BOSS", email: "jatin.sharma@ilogsolution.com", name: "Jatin Sharma" },
        { role: "ADMIN", email: "testadmin@awlindia.com", name: "Admin AWL" },
        { role: "VENDOR", email: "desklap@gmail.com", name: "DeskLap Procurement" },
        { role: "VENDOR", email: "jiya@awlinda.com", name: "Jiya Sharma" },
    ]

    for (const u of users) {
        console.log(`  [${u.role.padEnd(6)}]  ${u.email.padEnd(38)} → ${u.name}`)
    }

    console.log("\n📊  DATA SUMMARY\n")
    console.log(`  Categories      : 7  (IT tree + Operations tree)`)
    console.log(`  Items           : 15 (hardware, software, logistics)`)
    console.log(`  VP Vendors      : 3  (DeskLap IT, iLog AMC, Jiya Logistics)`)
    console.log(`  Purchase Orders : 4  (ACKNOWLEDGED, APPROVED, SUBMITTED, DRAFT)`)
    console.log(`  Proforma Inv.   : 3  (ACCEPTED+converted, SUBMITTED, DRAFT)`)
    console.log(`  Invoices        : 5  (CONFIRMED, APPROVED, UNDER_REVIEW, SUBMITTED, DRAFT)`)
    console.log(`  Payments        : 2  (COMPLETED, INITIATED)`)
    console.log(`  Deliveries      : 1  (APPROVED for PO1)`)
    console.log(`  Notifications   : 15 (mix of read/unread across all roles)`)
    console.log(`  Settings        : 14`)

    console.log("\n🔑  WHAT EACH ROLE WILL SEE ON LOGIN\n")
    console.log(`  BOSS   → 1 PO pending approval, 1 PI pending approval,`)
    console.log(`           1 invoice under review, 1 payment to confirm`)
    console.log(`  ADMIN  → 1 submitted invoice to start review, 2 POs in-flight`)
    console.log(`  VENDOR (DeskLap) → 2 POs, 3 invoices (1 draft), 1 PI accepted`)
    console.log(`  VENDOR (Jiya)    → 2 POs, 2 invoices, delivery record`)
    console.log("")
}

// ─────────────────────────────────────────────────────────────────────────────

main()
    .catch((e) => {
        console.error("\n❌  Seed failed:", e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())