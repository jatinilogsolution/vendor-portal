import { BillToAddress } from "@/actions/wms/warehouse"
import { NextResponse } from "next/server"
 
export async function GET() {
  try {
    const warehouses = await BillToAddress()
    return NextResponse.json(warehouses)
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 })
  }
}
