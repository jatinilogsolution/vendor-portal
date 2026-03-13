# VENDOR PORTAL — SYSTEM DESIGN & PHASED BUILD PLAN
### For Codex — Phased Development Reference

> ⚠️ **CRITICAL:** `Transporteradmin` and `Transport Admin` modules must remain **100% untouched** throughout all phases. All new code lives in its own namespace.

---

## TABLE OF CONTENTS

1. [Project Overview & Constraints](#1-project-overview--constraints)
2. [User Roles & Permissions Matrix](#2-user-roles--permissions-matrix)
3. [Module Breakdown — All Features](#3-module-breakdown--all-features)
4. [Data Models & Key Entities](#4-data-models--key-entities)
5. [Key Workflow Descriptions](#5-key-workflow-descriptions)
6. [Phase 1 — Foundation, Auth & Scaffolding](#6-phase-1--foundation-auth--scaffolding)
7. [Phase 2 — PO, PI & Vendor Invoice](#7-phase-2--po-pi--vendor-invoice)
8. [Phase 3 — Boss Approvals & Payments](#8-phase-3--boss-approvals--payments)
9. [Phase 4 — Delivery, Reporting & Audit](#9-phase-4--delivery-reporting--audit)
10. [Phase 5 — Polish, Security & Hardening](#10-phase-5--polish-security--hardening)
11. [Standing Rules for Codex](#11-standing-rules-for-codex)

---

## 1. Project Overview & Constraints

### 1.1 What This Portal Does

The Vendor Portal is an internal procurement and invoice management system with three distinct user roles. At a high level:

- **Vendors** submit invoices (upload PDF or fill a digital form), track their Purchase Orders and Proforma Invoices, and view payment status.
- **Admin** creates Purchase Orders (PO), Proforma Invoices (PI), manages vendor accounts, categories, and item masters, and oversees all documents.
- **Boss (Finance Dept)** reviews and approves all documents, authorises payments, confirms deliveries, and has full financial oversight.

Vendor details already exist in the system. **This portal must never modify those existing records.** New portal-specific data is stored in new, prefixed tables with a foreign key reference only.

---

### 1.2 Critical Constraints — Codex Must Read Before Starting Any Phase

| Constraint | Detail |
|---|---|
| **DO NOT TOUCH** | `Transporteradmin` module — all files, routes, DB tables, APIs |
| **DO NOT TOUCH** | `Transport Admin` module — all files, routes, DB tables, APIs |
| **NO HALT POLICY** | Vendor Portal phases must never pause or break Transport modules |
| **SEPARATE NAMESPACE** | All new routes use prefix `/vendor-portal/` |
| **SEPARATE DB TABLES** | All new tables prefixed `vp_` (e.g. `vp_vendors`, `vp_pos`) |
| **REVIEW GATE** | Before each phase, Codex reads all previous phase code and confirms no regressions |
| **VENDOR DETAILS** | Existing vendor records (name, bank, address, etc.) — **READ ONLY**, never modify |
| **NEW VENDOR DATA** | New portal fields go in `vp_vendors` with a FK pointing to the existing record only |

---

## 2. User Roles & Permissions Matrix

### 2.1 Role Definitions

| Role | Who They Are | Login | Primary Concern |
|---|---|---|---|
| **VENDOR** | External company / supplier | Email + Password (portal-issued) | Submit invoices, track POs/PIs, view payment status |
| **ADMIN** | Internal staff (Vendor Admin) | SSO or internal credentials | Create POs/PIs, manage categories, manage vendors, oversee all documents |
| **BOSS** | Finance Department Head | SSO or internal credentials | Approve documents, authorise payments, confirm delivery |

---

### 2.2 Full Permissions Matrix

| Feature / Action | Vendor | Admin | Boss |
|---|---|---|---|
| View own company profile | READ | READ/WRITE | READ |
| View all vendor profiles | ✗ | READ/WRITE | READ |
| Create Vendor account | ✗ | ✅ | ✗ |
| Create Categories | ✗ | ✅ | ✗ |
| View Categories | READ | READ/WRITE | READ |
| Create Item Master entries | ✗ | ✅ | ✗ |
| Create Purchase Order (PO) | ✗ | ✅ | ✗ |
| Edit PO (before approval) | ✗ | ✅ | ✗ |
| View PO assigned to them | READ | READ/WRITE | READ/WRITE |
| **Approve / Reject PO** | ✗ | ✗ | ✅ |
| Create Proforma Invoice (PI) | ✗ | ✅ | ✗ |
| Edit PI (before approval) | ✗ | ✅ | ✗ |
| View PI assigned to them | READ | READ/WRITE | READ/WRITE |
| **Approve / Reject PI** | ✗ | ✗ | ✅ |
| Upload Invoice (PDF) | ✅ | ✗ (view only) | READ |
| Create Invoice (digital form) | ✅ | ✗ (view only) | READ |
| Admin creates invoice for vendor | ✗ | ✅ | READ |
| **Verify / Reject Invoice** | ✗ | ✗ | ✅ |
| **Initiate Payment** | ✗ | ✗ | ✅ |
| **Confirm Payment Sent** | ✗ | ✗ | ✅ |
| View Payment Status | READ | READ | READ/WRITE |
| **Delivery Approval** | ✗ | ✗ | ✅ |
| Delivery Confirmation (vendor side) | ✅ | ✗ | ✗ |
| View Audit Trail | Own docs only | All docs | All docs |
| Generate Reports | Own reports | All reports | All reports |
| Send Notifications / Messages | ✗ | ✅ | ✅ |
| Manage Item Master | ✗ | ✅ | READ |

---

## 3. Module Breakdown — All Features

### 3.1 Auth & User Management

- Login page with role-based redirect on success (Vendor → Vendor Dashboard, Admin → Admin Dashboard, Boss → Boss Dashboard).
- Forgot password / reset flow for all roles.
- Admin creates Vendor accounts (email + temporary password issued; vendor must change on first login).
- Admin can deactivate / reactivate vendor accounts.
- Session management: JWT tokens with refresh, configurable expiry.
- Role guard on every route — unauthorised access returns a 403 page.

---

### 3.2 Vendor Management (Admin-Owned)

> **Note:** Existing vendor records are **READ ONLY**. This module stores new data in `vp_vendors` with a FK to the existing record only.

- Admin creates a portal profile for a vendor (if not already present).
- New data stored in `vp_vendors` with `fk_existing_vendor_id` pointing to the existing record — the original record is **never touched**.
- Admin assigns vendors to categories.
- Vendor profile page displays: name, contact, bank details (from existing record, read-only), portal activity summary.
- Admin can search and filter vendors by name, category, and status.

---

### 3.3 Category Management (Admin-Owned)

- Admin creates top-level categories (e.g. Raw Materials, IT Services, Logistics).
- Admin creates sub-categories under each category.
- Categories classify POs, PIs, and vendors.
- Admin can rename, deactivate, or archive a category.
- Deactivated categories are hidden from new document creation but existing records retain their reference.
- Category list view with document count per category.

---

### 3.4 Item Master (Admin-Owned)

- Admin maintains a library of standard items and services used as line items in POs and PIs.
- Each item has: code, name, unit of measure, default price, category, HSN/SAC code, description.
- Items are searchable and selectable when building PO/PI line items.
- Admin can edit items; changes **do not** retroactively alter already-saved documents (snapshot at creation time).

---

### 3.5 Purchase Order (PO) Module

Admin creates POs. Boss must approve before the vendor sees anything.

**Status Flow:**
```
DRAFT → SUBMITTED → APPROVED / REJECTED → SENT_TO_VENDOR → ACKNOWLEDGED → CLOSED
```

- Admin fills PO form: vendor, category, delivery date, line items (item master or free-text), terms, notes.
- Auto-generated PO number format: `PO-YYYY-NNNN`.
- Boss receives in-app + email notification on submission.
- Boss approves with comments or rejects with reason.
- On approval, Admin clicks "Send to Vendor" — PO appears on the vendor's dashboard.
- Vendor acknowledges receipt → status becomes `ACKNOWLEDGED`.
- Admin can edit only `DRAFT` status POs.
- Boss can add internal notes at any stage.

---

### 3.6 Proforma Invoice (PI) Module

Admin creates PIs (often before a formal PO). Same approval chain as PO.

**Status Flow:**
```
DRAFT → SUBMITTED → APPROVED / REJECTED → SENT_TO_VENDOR → ACCEPTED / DECLINED → CONVERTED_TO_PO (optional) → CLOSED
```

- Admin creates PI: vendor, items, amount, validity date, payment terms.
- Auto-number format: `PI-YYYY-NNNN`.
- Boss approves/rejects. Approved PI appears on vendor's dashboard.
- Vendor can Accept or Decline a PI with a reason.
- Admin can convert an approved PI into a PO in one click (pre-fills PO form from PI data).

---

### 3.7 Vendor Invoice Module

Two sub-flows exist:

**Flow A — Vendor Self-Service:**
- Vendor uploads a PDF invoice OR fills a digital invoice form.
- Invoice optionally linked to a PO or PI reference number.
- Status flow: `DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED / REJECTED / REVISION_REQUESTED → PAYMENT_INITIATED → PAYMENT_CONFIRMED`

**Flow B — Admin Creates Invoice for Vendor:**
- Admin creates the invoice entry and assigns it to the vendor.
- Vendor sees it in their dashboard.
- Same status chain applies.

Boss reviews the invoice against the linked PO/PI, then approves, rejects (with reason), or requests a revision. Vendor is notified at every status change.

---

### 3.8 Payments Module (Boss-Owned)

- Boss views a payment queue of all approved invoices awaiting payment.
- Boss selects an invoice, enters: amount, payment date, payment mode (Bank Transfer / Cheque / NEFT / RTGS), transaction reference.
- Payment statuses: `INITIATED → PROCESSING → COMPLETED / FAILED`
- Vendor sees payment status on their invoice in real time.
- Boss views full payment history with filters (date range, vendor, amount, status).
- Payment summary reports exportable as PDF and Excel.

---

### 3.9 Delivery Management Module (Boss-Owned)

- Vendor dispatches goods → logs a Delivery Confirmation in the portal (date + notes).
- Boss creates a Delivery Record linked to the PO.
- Delivery record contains: delivery date, delivered by (vendor), received by (internal person name), items delivered with quantities, condition notes, supporting document upload (optional).
- Boss clicks "Delivery Approved" to close the record.
- If partial delivery, Boss marks `PARTIAL_DELIVERY` — remaining items tracked, PO stays open.
- Full delivery audit trail visible to Admin and Boss.

**Delivery Status Flow:**
```
PENDING → PARTIAL_DELIVERY / FULLY_DELIVERED → APPROVED
```

---

### 3.10 Notifications & Alerts

- In-app notification bell for all roles.
- Email notifications for critical events:
  - PO submitted → Boss notified
  - PO approved/rejected → Admin notified
  - PO sent to vendor → Vendor notified
  - Invoice submitted → Boss notified
  - Invoice approved/rejected → Vendor notified
  - Payment confirmed → Vendor notified
- Admin can manually send a message/note to any vendor from the portal.
- Notification preferences configurable per user.

---

### 3.11 Audit Trail & Activity Log

- Every create, edit, status change, approval, and payment is logged with: user, role, action, timestamp, old value → new value.
- Vendors see the audit log for their own documents only.
- Admin and Boss can see the full system audit log.
- Audit log is searchable by date range, user, and document type.

---

### 3.12 Reports & Analytics

| Report | Available To |
|---|---|
| Vendor activity summary | Admin, Boss |
| PO list by status | Admin, Boss |
| PI list by status | Admin, Boss |
| Category spend breakdown | Admin, Boss |
| Payment summary | Boss |
| Pending approvals aging report | Boss |
| Delivery status report | Boss |
| Vendor invoice aging report | Boss |
| My invoices status | Vendor |
| My payment history | Vendor |

All reports are filterable by date range, vendor, and category. Export to PDF and Excel supported.

---

## 4. Data Models & Key Entities

> All new tables are prefixed `vp_` — zero collision with existing Transport module tables.

### 4.1 Database Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `vp_users` | Portal users (Vendor / Admin / Boss) | `id`, `role`, `email`, `hashed_password`, `status`, `created_at` |
| `vp_vendors` | Vendor portal records (new only) | `id`, `fk_existing_vendor_id` (READ-ONLY FK), `category_id`, `portal_status`, `created_by` |
| `vp_categories` | Category & sub-category tree | `id`, `parent_id`, `name`, `code`, `status` |
| `vp_items` | Item master library | `id`, `code`, `name`, `uom`, `default_price`, `category_id`, `hsn_code` |
| `vp_purchase_orders` | PO header record | `id`, `po_number`, `vendor_id`, `category_id`, `status`, `created_by`, `approved_by`, `created_at` |
| `vp_po_line_items` | PO line details | `id`, `po_id`, `item_id`, `description`, `qty`, `unit_price`, `total` |
| `vp_proforma_invoices` | PI header record | `id`, `pi_number`, `vendor_id`, `category_id`, `status`, `created_by`, `approved_by` |
| `vp_pi_line_items` | PI line details | `id`, `pi_id`, `item_id`, `description`, `qty`, `unit_price`, `total` |
| `vp_invoices` | Vendor invoice header | `id`, `invoice_number`, `vendor_id`, `po_id` (nullable), `pi_id` (nullable), `type`, `status`, `total_amount`, `created_by` |
| `vp_invoice_line_items` | Invoice line details | `id`, `invoice_id`, `description`, `qty`, `unit_price`, `tax`, `total` |
| `vp_invoice_documents` | Uploaded PDF invoices | `id`, `invoice_id`, `file_path`, `uploaded_by`, `uploaded_at` |
| `vp_payments` | Payment records | `id`, `invoice_id`, `amount`, `payment_date`, `payment_mode`, `transaction_ref`, `status`, `initiated_by` |
| `vp_delivery_records` | Delivery management | `id`, `po_id`, `delivery_date`, `dispatched_by`, `received_by`, `status`, `notes` |
| `vp_delivery_items` | Items in a delivery | `id`, `delivery_id`, `po_line_item_id`, `qty_delivered`, `condition` |
| `vp_notifications` | In-app notification log | `id`, `user_id`, `type`, `message`, `ref_doc_type`, `ref_doc_id`, `is_read`, `created_at` |
| `vp_audit_logs` | Full audit trail | `id`, `user_id`, `action`, `entity_type`, `entity_id`, `old_value`, `new_value`, `ip`, `timestamp` |

---

### 4.2 Document Status Enumerations

| Document | Status Flow |
|---|---|
| Purchase Order (PO) | `DRAFT → SUBMITTED → APPROVED → SENT_TO_VENDOR → ACKNOWLEDGED → CLOSED` (REJECTED at any Boss stage) |
| Proforma Invoice (PI) | `DRAFT → SUBMITTED → APPROVED → SENT_TO_VENDOR → ACCEPTED / DECLINED → CONVERTED_TO_PO → CLOSED` |
| Vendor Invoice | `DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED / REJECTED / REVISION_REQUESTED → PAYMENT_INITIATED → PAYMENT_CONFIRMED` |
| Payment | `INITIATED → PROCESSING → COMPLETED / FAILED` |
| Delivery Record | `PENDING → PARTIAL_DELIVERY → FULLY_DELIVERED → APPROVED` |

---

## 5. Key Workflow Descriptions

### 5.1 PO Workflow (Admin Creates → Boss Approves → Vendor Sees)

```
1. Admin logs in → PO → Create New PO
2. Admin selects vendor, category, fills line items, delivery date, notes
3. Admin saves as DRAFT or submits directly to Boss
4. Boss receives in-app + email notification
5. Boss reviews → Approves (with comments) OR Rejects (with reason)
   └─ If Rejected: Admin notified, edits and resubmits
6. If Approved: Admin clicks "Send to Vendor"
7. Vendor sees PO in dashboard with PENDING ACKNOWLEDGEMENT badge
8. Vendor reviews and clicks Acknowledge → PO = ACKNOWLEDGED
9. PO closes automatically when linked invoice is paid AND delivery confirmed
```

---

### 5.2 Vendor Invoice (Self-Service) Workflow

```
1. Vendor logs in → My Invoices → Create Invoice
2. Vendor selects: Upload PDF  OR  Fill Digital Form
3. Vendor optionally links to a PO or PI number
4. Vendor submits → Invoice status = SUBMITTED
5. Boss notified → Boss opens invoice, cross-checks against PO/PI
6. Boss Approves OR Rejects (with reason) OR Requests Revision
   └─ If Rejected/Revision: Vendor notified with reason, resubmits
7. If Approved: Boss → Payments → selects invoice → enters payment details → Initiate Payment
8. Payment status updates. Vendor notified when PAYMENT_CONFIRMED
```

---

### 5.3 Delivery Approval Workflow

```
1. Vendor dispatches goods → logs Delivery Confirmation in portal (date + notes)
2. Boss creates Delivery Record linked to the PO
3. Boss fills: received items, quantities, condition notes, received-by name
4. If full delivery → Boss clicks Delivery Approved → delivery closed, PO moves to CLOSED
5. If partial → Boss marks PARTIAL DELIVERY → remaining items tracked, PO stays open
6. All steps logged in vp_audit_logs
```

---

### 5.4 PI → PO Conversion Workflow

```
1. Admin creates PI → submits to Boss
2. Boss approves PI
3. Admin clicks "Convert to PO" → PO form pre-filled from PI data
4. Admin reviews pre-filled PO, adjusts if needed, submits to Boss
5. Standard PO approval flow continues from here
```

---

## 6. Phase 1 — Foundation, Auth & Scaffolding

| Item | Detail |
|---|---|
| **Phase Goal** | Set up the entire project foundation without touching any Transport module |
| **Estimated Effort** | Sprint 1 — 1 to 2 weeks |
| **Review Gate** | Codex reads all existing Transport module files BEFORE starting. Confirms zero route/table name conflicts. |

### 6.1 Deliverables

- [ ] Project folder structure: `/vendor-portal/` directory created. All new files live here.
- [ ] Database migrations: Create all `vp_` tables (see Section 4.1). No modifications to existing tables.
- [ ] Authentication: Login page for all 3 roles. JWT-based auth. Role-based redirect on login. Protected route middleware.
- [ ] Role dashboards: Shell dashboards for Vendor, Admin, Boss — placeholders with correct navigation menus.
- [ ] Vendor account creation: Admin can create a vendor user account. Vendor receives email with credentials.
- [ ] Basic vendor profile page (READ ONLY from existing system + new `vp_vendors` fields side by side).
- [ ] Unit tests for auth flow.

### 6.2 What NOT to Build in Phase 1

- No PO, PI, or Invoice features.
- No payments, no delivery, no reports.
- No modifications to any Transport Admin or Transporteradmin code.

### 6.3 Codex Step-by-Step Instructions

```
Step 1: List all existing routes — confirm none start with /vendor-portal/
Step 2: List all existing DB tables — confirm none start with vp_
Step 3: Create migration files for all vp_ tables listed in Section 4.1
Step 4: Build auth module (login, JWT, role guard, password reset)
Step 5: Build dashboard shells for all 3 roles
Step 6: Build Admin → Create Vendor Account flow
Step 7: Build vendor profile page (read-only from existing record)
Step 8: Run full regression on all existing transport routes — confirm 0 failures
```

---

## 7. Phase 2 — PO, PI & Vendor Invoice

| Item | Detail |
|---|---|
| **Phase Goal** | Full document creation and submission flows for Admin and Vendor |
| **Estimated Effort** | Sprint 2–3 — 2 to 3 weeks |
| **Review Gate** | Confirm Phase 1 tests still pass. Read all Phase 1 code before writing new code. |

### 7.1 Deliverables

- [ ] **Category Management:** Full CRUD for categories and sub-categories (Admin only).
- [ ] **Item Master:** Full CRUD for items (Admin only). Search and select in document forms.
- [ ] **PO Module (Draft + Submit only):** Admin creates, edits, and submits PO to Boss. Statuses: `DRAFT`, `SUBMITTED`. Boss sees list but approval action comes in Phase 3.
- [ ] **PI Module (Draft + Submit only):** Same flow as PO.
- [ ] **Vendor Invoice — Upload Flow:** Vendor uploads PDF. Stored in `vp_invoice_documents`. Invoice record created in `vp_invoices` with status `SUBMITTED`.
- [ ] **Vendor Invoice — Digital Form Flow:** Vendor fills digital form with line items. Saved to `vp_invoices` + `vp_invoice_line_items`.
- [ ] **Admin creates invoice for vendor:** Admin creates invoice entry, assigns to a vendor. Vendor sees it in their dashboard.
- [ ] **Vendor Dashboard:** My POs list, My PIs list, My Invoices list — with status badges.
- [ ] **Admin Dashboard:** All POs, All PIs, All Invoices — with filter and search.

### 7.2 Codex Step-by-Step Instructions

```
Step 1: Read all Phase 1 code — do not modify auth or user management
Step 2: Build Category + Sub-category CRUD (Admin only)
Step 3: Build Item Master CRUD (Admin only)
Step 4: Build PO form with line item selection from Item Master
Step 5: Build PI form with line item selection from Item Master
Step 6: Build Vendor Invoice — PDF upload flow
Step 7: Build Vendor Invoice — digital form flow
Step 8: Build Admin → Create Invoice for Vendor flow
Step 9: Enforce vendor_id filter — vendors only see their own documents
Step 10: Run Phase 1 tests + transport regression — confirm 0 failures
```

---

## 8. Phase 3 — Boss Approvals & Payments

| Item | Detail |
|---|---|
| **Phase Goal** | All Boss approval flows and payment processing |
| **Estimated Effort** | Sprint 4–5 — 2 to 3 weeks |
| **Review Gate** | Confirm Phase 1 + Phase 2 tests pass. Read Phase 2 code before starting. |

### 8.1 Deliverables

- [ ] **Boss PO Approval:** Boss approves/rejects with comments. On approval, Admin can "Send to Vendor."
- [ ] **Boss PI Approval:** Boss approves/rejects. On approval, Admin can "Send to Vendor."
- [ ] **Vendor PO Interaction:** Vendor acknowledges received PO.
- [ ] **Vendor PI Interaction:** Vendor accepts or declines PI with reason.
- [ ] **PI → PO Conversion:** Admin converts approved PI into a PO in one click.
- [ ] **Boss Invoice Review:** Boss cross-checks invoice vs PO/PI, approves / rejects / requests revision.
- [ ] **Payments Module:** Boss payment queue. Boss enters payment details. Payment record created. Status tracked to `COMPLETED`.
- [ ] **Boss Dashboard widgets:** Pending approvals count, payment queue count.
- [ ] **In-app notifications** for all approval events.
- [ ] **Email notifications:** PO submitted, PO approved, PO sent to vendor, Invoice approved, Payment confirmed.

### 8.2 Codex Step-by-Step Instructions

```
Step 1: Read Phase 1 + Phase 2 code in full before writing anything
Step 2: Build Boss PO approval/rejection UI and API
Step 3: Build Boss PI approval/rejection UI and API
Step 4: Build Vendor acknowledge PO flow
Step 5: Build Vendor accept/decline PI flow
Step 6: Build PI → PO one-click conversion
Step 7: Build Boss Invoice review UI and API
Step 8: Build Payments module — payment queue, entry form, status tracking
Step 9: Build Boss dashboard widgets (approval counts, payment queue)
Step 10: Build in-app notification system (vp_notifications table)
Step 11: Build email notification triggers for critical events
Step 12: ENFORCE server-side: payment initiation only allowed when invoice.status === APPROVED
Step 13: Run Phase 1 + Phase 2 tests + transport regression — confirm 0 failures
```

---

## 9. Phase 4 — Delivery, Reporting & Audit

| Item | Detail |
|---|---|
| **Phase Goal** | Delivery management, full reporting suite, and audit trail UI |
| **Estimated Effort** | Sprint 6 — 1 to 2 weeks |
| **Review Gate** | Confirm Phase 1 + 2 + 3 tests pass. Read Phase 3 code before starting. |

### 9.1 Deliverables

- [ ] **Vendor Delivery Confirmation:** Vendor logs dispatch date and notes in portal.
- [ ] **Boss Delivery Record:** Boss creates delivery record linked to PO, enters items received, quantities, condition, received-by.
- [ ] **Boss Delivery Approval action:** Full delivery → `APPROVED`. Partial → `PARTIAL_DELIVERY` with remaining items tracked.
- [ ] **PO Auto-Close Logic:** PO moves to `CLOSED` only when BOTH delivery is `APPROVED` AND invoice is `PAYMENT_CONFIRMED`.
- [ ] **Admin Reports:** PO status report, PI status report, vendor activity, category spend breakdown.
- [ ] **Boss Reports:** Payment summary, pending approvals aging, delivery status, invoice aging.
- [ ] **Vendor Reports:** My invoices, my payment history.
- [ ] **PDF and Excel export** for all reports.
- [ ] **Audit Trail UI:** Searchable log page for Admin and Boss. Vendor sees own-document-only view.

### 9.2 Codex Step-by-Step Instructions

```
Step 1: Read Phases 1–3 code before starting
Step 2: Build Vendor dispatch confirmation UI + API
Step 3: Build Boss delivery record creation + item entry
Step 4: Build Boss delivery approval action (full and partial)
Step 5: Build PO auto-close logic — check BOTH delivery AND payment before closing
Step 6: Build all report queries (read-only — no writes in reports)
Step 7: Build report UI with filters (date range, vendor, category)
Step 8: Build PDF export for reports
Step 9: Build Excel export for reports
Step 10: Build audit trail UI (role-filtered views)
Step 11: Run full regression across all phases + transport — confirm 0 failures
```

---

## 10. Phase 5 — Polish, Security & Hardening

| Item | Detail |
|---|---|
| **Phase Goal** | Production readiness: security, UI polish, edge cases, final QA |
| **Estimated Effort** | Sprint 7 — 1 to 2 weeks |
| **Review Gate** | Full system regression across all phases + transport. Performance baseline test. |

### 10.1 Deliverables

- [ ] **Security hardening:** CSRF protection, rate limiting on auth endpoints, input sanitisation on all fields, SQL injection review, file upload validation (PDF/image only, max 10MB).
- [ ] **Notification preferences:** Per-user settings for which email notifications to receive.
- [ ] **UI / UX polish:** Consistent status badge colours across all modules. Loading states, empty states, error states. Mobile-responsive layouts.
- [ ] **Server-side pagination:** All list views (PO, PI, invoice, payment history) paginated server-side.
- [ ] **Search & filters:** Saved filter state in URL params for shareable filtered views.
- [ ] **Edge case handling:**
  - Duplicate invoice number prevention
  - Prevent double-payment on the same invoice
  - Prevent approval of already-approved documents
  - Concurrent edit protection
- [ ] **Final QA checklist:** Every workflow tested end-to-end for all 3 roles.
- [ ] **Final transport regression:** Confirmed `Transporteradmin` and `Transport Admin` are 100% unaffected.

---

## 11. Standing Rules for Codex

> These rules apply for **every single phase**. No exceptions.

| Rule | Instruction | Reason |
|---|---|---|
| **R-01** | Before writing any code in a new phase, read all previous phase code and confirm no regressions | Prevent breaking shipped features |
| **R-02** | Run existing transport module tests before AND after each phase | Transporteradmin and Transport Admin must never halt |
| **R-03** | All new routes use prefix `/vendor-portal/` | Avoid collision with existing routes |
| **R-04** | All new DB tables use prefix `vp_` | Avoid collision with existing tables |
| **R-05** | Never modify or overwrite any record referenced by `fk_existing_vendor_id` | Existing vendor data is read-only |
| **R-06** | All status transitions enforced **server-side**, not just client-side | Security and data integrity |
| **R-07** | Every action that changes data must write a row to `vp_audit_logs` | Full traceability required |
| **R-08** | Vendor users can only see documents where `vendor_id` matches their account | Data isolation — critical security rule |
| **R-09** | Payment initiation must validate `invoice.status === APPROVED` server-side before proceeding | Prevent payment on unapproved invoices |
| **R-10** | File uploads must validate type (PDF / image only) and size (max 10MB) | Security and storage management |
| **R-11** | If any test fails at a review gate, STOP and fix before continuing the phase | No broken phases |
| **R-12** | Do not build features planned for a later phase ahead of schedule | Controlled incremental delivery |

---

### 11.1 Recommended Tech Stack

> Use whatever the existing project already uses. These are defaults if starting fresh.

| Layer | Recommended |
|---|---|
| Backend | Node.js / Express or existing project framework |
| Database | PostgreSQL or MySQL — match the existing project |
| Frontend | React / Next.js or existing project framework |
| Auth | JWT with refresh tokens, bcrypt for password hashing |
| File Storage | Local `/uploads/vendor-invoices/` or AWS S3 (separate from transport files) |
| Email | Nodemailer or existing email service |
| PDF Export | PDFKit or Puppeteer |
| Excel Export | ExcelJS or SheetJS |

---

### 11.2 Phase Summary

| Phase | Focus | Key Output | Gate |
|---|---|---|---|
| **Phase 1** | Auth, DB setup, vendor management | Login, dashboards, vendor accounts | Transport regression passes |
| **Phase 2** | Document creation | PO, PI, Invoice (create + submit) | Phase 1 tests pass |
| **Phase 3** | Approvals & payments | Boss approval flows, payments, notifications | Phase 1+2 tests pass |
| **Phase 4** | Delivery, reports, audit | Delivery module, full reports, audit trail UI | Phase 1+2+3 tests pass |
| **Phase 5** | Polish & hardening | Security, edge cases, final QA | All phases + transport pass |

---

*End of Document — Hand to Codex phase by phase. Codex must read and acknowledge all constraints before each phase begins.*
