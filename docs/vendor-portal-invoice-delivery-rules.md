# Vendor Portal Invoice and Delivery Handling

## GST handling

- Vendor invoices now use a single invoice-level GST rate.
- Line items no longer carry separate editable GST values.
- Every stored invoice line inherits the invoice GST rate so totals stay consistent across form, review, and payment flows.

## PO-wise invoice quantity handling

- If a PO has delivery records, invoiceable quantity is calculated as `delivered qty - already invoiced qty`.
- If a PO has no delivery records yet, invoiceable quantity falls back to `ordered qty - already invoiced qty`.
- Rejected invoices are excluded from the already-invoiced calculation, so those quantities can be billed again after correction.
- PO-linked invoice lines are validated server-side, not only in the UI.
- For PO-linked invoices, the system persists the PO line description and unit price to avoid drift from manual edits.

## Partial and extra delivery handling

- Deliveries can now be partial.
- Delivery forms also allow extra quantity beyond the ordered balance when actual receipt is higher than the PO quantity.
- Extra delivery is surfaced in the delivery UI and becomes billable in PO-wise invoice flow because billing follows delivered quantity when delivery records exist.

## Payment notes

- Boss can enter a payment note while initiating payment.
- The note is stored on the payment record.
- The same note is shown in payment history, invoice payment sections, and payment emails.

## Email notifications

- Vendor portal emails now use tagged subjects such as `[VP][INVOICE][SUBMITTED]` for easier filtering.
- Admin and boss users are included on email communication through internal CC handling so both roles receive the notifications.
- Payment emails include the optional boss note for better context.
