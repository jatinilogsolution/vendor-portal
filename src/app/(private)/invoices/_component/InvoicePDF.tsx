"use client"
import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    //   Font,
    Link,
    Font
} from "@react-pdf/renderer"
import { amountToWords } from "@/utils/amountToWords"
import { formatCurrency } from "@/utils/calculations"

if (!Font.getRegisteredFontFamilies().includes("Inter")) {
  Font.register({
    family: "Inter",
    fonts: [
      { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTtLmw04.ttf", fontWeight: "normal" },
      { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTtLmw04.ttf", fontWeight: "bold" }
    ]
  })
}
const styles = StyleSheet.create({
    page: {
        fontFamily: "Inter",
        fontSize: 10,
        padding: 30,
        backgroundColor: "#fff",
        color: "#333"
    },
    header: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingBottom: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    companyName: {
        fontSize: 12,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        paddingBottom: 3,
    },
    text: {
        marginBottom: 2,
    },
    table: {
        display: "flex",
        width: "auto",
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHeader: {
        fontWeight: "bold",
        backgroundColor: "#f9f9f9",
    },
    tableCell: {
        flex: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 4,
        fontSize: 9,
    },
    rightText: {
        textAlign: "right",
    },
    centerText: {
        textAlign: "center",
    },
    totalSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    amountWords: {
        width: "60%",
        borderLeftWidth: 3,
        borderColor: "#ccc",
        paddingLeft: 6,
        fontStyle: "italic",
        fontSize: 10
    },
    totalsBox: {
        width: "35%",
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 6,
        backgroundColor: "#f8f8f8",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    footer: {
        borderTopWidth: 1,
        borderColor: "#ddd",
        marginTop: 20,
        paddingTop: 10,
        textAlign: "center",
        fontSize: 9,
        color: "#666"
    }
})

export const InvoicePDF = ({ invoice }: { invoice: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text  style={styles.title}>INVOICE</Text>
                    <Text>Invoice #: {invoice.invoiceNumber}</Text>
                    <Text>Date: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={{ textAlign: "right" }}>
                    <Text style={styles.companyName}>AWL India Pvt. Ltd.</Text>
                    <Text>Gurgaon, Haryana</Text>
          <Text>GSTIN: 06AAICA1234L1ZK</Text>
                </View>
            </View>

            {/* VENDOR & BILLING */}
            <View style={styles.section}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ width: "48%" }}>
                        <Text style={styles.subTitle}>Vendor Details</Text>
                        <Text style={styles.text}>Name: {invoice.vendor?.name}</Text>
                        <Text style={styles.text}>Email: {invoice.vendor?.contactEmail || "-"}</Text>
                        <Text style={styles.text}>Phone: {invoice.vendor?.contactPhone || "-"}</Text>
                    </View>
                    <View style={{ width: "48%" }}>
                        <Text style={styles.subTitle}>Bill To</Text>
                        <Text>{invoice.billTo}</Text>
                        <Text>GSTIN: {invoice.billToGstin}</Text>
                    </View>
                </View>
            </View>

            {/* LR TABLE */}
            <View style={styles.section}>
                <Text style={styles.subTitle}>LRs Included in this Invoice</Text>

                <View style={styles.table}>
                    {/* Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, { flex: 1.2 }]}>LR Number</Text>
                        <Text style={[styles.tableCell, { flex: 1.2 }]}>Vehicle</Text>
                        <Text style={styles.tableCell}>Origin</Text>
                        <Text style={styles.tableCell}>Destination</Text>
                        <Text style={[styles.tableCell, styles.rightText]}>Price</Text>
                        <Text style={[styles.tableCell, styles.rightText]}>Extra</Text>
                        <Text style={[styles.tableCell, styles.centerText]}>POD</Text>
                    </View>

                    {/* Rows */}
                    {invoice.LRRequest?.map((lr: any) => (
                        <View style={styles.tableRow} key={lr.id}>
                            <Text style={[styles.tableCell, { flex: 1.2 }]}>{lr.LRNumber}</Text>
                            <Text style={[styles.tableCell, { flex: 1.2 }]}>
                                {lr.vehicleType} ({lr.vehicleNo})
                            </Text>
                            <Text style={styles.tableCell}>{lr.origin}</Text>
                            <Text style={styles.tableCell}>{lr.destination}</Text>
                            <Text style={[styles.tableCell, styles.rightText]}>{formatCurrency(lr.priceSettled || 0)}</Text>
                            <Text style={[styles.tableCell, styles.rightText]}>{formatCurrency(lr.extraCost || 0)}</Text>
                            <Text style={[styles.tableCell, styles.centerText]}>
                                {lr.podlink ? <Link src={lr.podlink}>View</Link> : "-"}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* TOTALS */}
            <View style={styles.totalSection}>
                <View style={styles.amountWords}>
                    <Text>{amountToWords(invoice.grandTotal)}</Text>
                </View>

                <View style={styles.totalsBox}>
                    <View style={styles.totalRow}>
                        <Text>Subtotal:</Text>
                        <Text>{formatCurrency(invoice.subtotal || 0)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text>Tax ({invoice.taxRate || 0}%):</Text>
                        <Text>{formatCurrency(invoice.taxAmount || 0)}</Text>
                    </View>
                    <View style={[styles.totalRow, { borderTopWidth: 1, borderColor: "#aaa", marginTop: 3, paddingTop: 3 }]}>
                        <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
                        <Text style={{ fontWeight: "bold" }}>{formatCurrency(invoice.grandTotal || 0)}</Text>
                    </View>
                    <View style={{ marginTop: 5, textAlign: "right" }}>
                        <Text>Status: {invoice.status}</Text>
                    </View>
                </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text>This is a computer-generated invoice and does not require a signature.</Text>
                <Text>Thank you for your business!</Text>
            </View>
        </Page>
    </Document>
)
