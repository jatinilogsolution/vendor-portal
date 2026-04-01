"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { IconTableExport } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { UOM_OPTIONS } from "@/validations/vp/item"
import { strFromU8, strToU8, unzipSync, zipSync } from "@/lib/vendor-portal/fflate"

type ItemUploadTemplateButtonProps = {
  categories: { id: string; name: string; code?: string | null }[]
  disabled?: boolean
}

const TEMPLATE_ROW_COUNT = 300

function patchSheetWithValidations(
  workbookBytes: Uint8Array,
  rowCount: number,
) {
  const files = unzipSync(workbookBytes)
  const sheetPath = "xl/worksheets/sheet1.xml"
  const rawSheetXml = files[sheetPath]
  if (!rawSheetXml) return workbookBytes

  const sheetXml = strFromU8(rawSheetXml)
  const validationXml = [
    `<dataValidations count="2">`,
    `<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" errorStyle="stop" sqref="C2:C${rowCount + 1}">`,
    `<formula1>VpUomOptions</formula1>`,
    `</dataValidation>`,
    `<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" errorStyle="stop" sqref="F2:F${rowCount + 1}">`,
    `<formula1>VpCategoryNames</formula1>`,
    `</dataValidation>`,
    `</dataValidations>`,
  ].join("")

  const nextSheetXml = sheetXml.includes("<ignoredErrors")
    ? sheetXml.replace("<ignoredErrors", `${validationXml}<ignoredErrors`)
    : sheetXml.replace("</worksheet>", `${validationXml}</worksheet>`)

  files[sheetPath] = strToU8(nextSheetXml)
  return zipSync(files)
}

function setSheetColumns(
  sheet: XLSX.WorkSheet,
  widths: number[],
) {
  sheet["!cols"] = widths.map((width) => ({ wch: width }))
}

export function ItemUploadTemplateButton({
  categories,
  disabled,
}: ItemUploadTemplateButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    setLoading(true)

    try {
      const uploadTemplateRows = [[
        "Code",
        "Name",
        "UOM",
        "Default Price",
        "HSN Code",
        "Category Name",
        "Category Code",
        "Description",
      ]]

      for (let rowIndex = 0; rowIndex < TEMPLATE_ROW_COUNT; rowIndex++) {
        uploadTemplateRows.push(["", "", "", "", "", "", "", ""])
      }

      const instructionsRows = [
        ["Step", "What to do"],
        ["1", "Fill item data in the Upload Template sheet."],
        ["2", "Use the Excel dropdown in the UOM column. Only portal UOM values are allowed."],
        ["3", "Use the Excel dropdown in the Category Name column. Category Code fills automatically."],
        ["4", "Do not type Category Code manually. It is formula-driven from the selected category."],
        ["5", "For import, copy filled rows from Upload Template and paste them into Bulk Add (Excel)."],
        ["6", "Code and Name are required. Default Price can be 0."],
      ]

      const categoryRows = categories.map((category) => ({
        "Category Name": category.name,
        "Category Code": category.code ?? "",
      }))

      const uomRows = UOM_OPTIONS.map((uom) => ({ UOM: uom }))

      const wb = XLSX.utils.book_new()

      const uploadSheet = XLSX.utils.aoa_to_sheet(uploadTemplateRows)
      const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsRows)
      const categoriesSheet = categoryRows.length > 0
        ? XLSX.utils.json_to_sheet(categoryRows)
        : XLSX.utils.aoa_to_sheet([["Category Name", "Category Code"]])
      const uomSheet = XLSX.utils.json_to_sheet(uomRows)

      for (let row = 2; row <= TEMPLATE_ROW_COUNT + 1; row++) {
        uploadSheet[`G${row}`] = {
          t: "str",
          f: `IF(F${row}="","",IFERROR(INDEX('Category Master'!$B$2:$B$${Math.max(categories.length + 1, 2)},MATCH(F${row},'Category Master'!$A$2:$A$${Math.max(categories.length + 1, 2)},0)),""))`,
        }
      }

      setSheetColumns(uploadSheet, [18, 32, 12, 14, 14, 28, 18, 36])
      setSheetColumns(instructionsSheet, [10, 90])
      setSheetColumns(categoriesSheet, [32, 20])
      setSheetColumns(uomSheet, [12])

      uploadSheet["!freeze"] = { xSplit: 0, ySplit: 1 }

      XLSX.utils.book_append_sheet(wb, uploadSheet, "Upload Template")
      XLSX.utils.book_append_sheet(wb, instructionsSheet, "Instructions")
      XLSX.utils.book_append_sheet(wb, categoriesSheet, "Category Master")
      XLSX.utils.book_append_sheet(wb, uomSheet, "UOM Master")

      wb.Workbook = wb.Workbook || {}
      wb.Workbook.Names = [
        {
          Name: "VpCategoryNames",
          Ref: `'Category Master'!$A$2:$A$${Math.max(categories.length + 1, 2)}`,
        },
        {
          Name: "VpUomOptions",
          Ref: `'UOM Master'!$A$2:$A$${UOM_OPTIONS.length + 1}`,
        },
      ]
      wb.Workbook.Sheets = wb.Workbook.Sheets || []
      wb.Workbook.Sheets[2] = { ...(wb.Workbook.Sheets[2] || {}), Hidden: 1 }
      wb.Workbook.Sheets[3] = { ...(wb.Workbook.Sheets[3] || {}), Hidden: 1 }

      const workbookBytes = new Uint8Array(XLSX.write(wb, { type: "array", bookType: "xlsx" }))
      const patchedWorkbookBytes = patchSheetWithValidations(workbookBytes, TEMPLATE_ROW_COUNT)
      const workbookArrayBuffer = patchedWorkbookBytes.slice().buffer as ArrayBuffer
      const blob = new Blob(
        [workbookArrayBuffer],
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      )
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `vp-item-upload-template-${new Date().toISOString().slice(0, 10)}.xlsx`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || loading}
    >
      <IconTableExport size={14} className="mr-1.5" />
      {loading ? "Preparing..." : "Export Upload Excel"}
    </Button>
  )
}
