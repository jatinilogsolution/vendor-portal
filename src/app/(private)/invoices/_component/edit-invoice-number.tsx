"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { toast } from 'sonner'
import { updateInvoiceNumberForInvoice } from '../_action/invoice'

const EditInvoiceNumber = ({ id, inv, vendorId }: { id: string, inv: string, vendorId: string }) => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        const input = e.currentTarget.querySelector<HTMLInputElement>(`#${id}-target`)
        if (!input) return

        const invoiceNumber = input.value.trim()

        // 🧠 Manual validation
        if (invoiceNumber.length < 1) {
          toast.error("Invoice number must be at least 1 character.")
          return
        }

        if (invoiceNumber.length > 20) {
          toast.error("Invoice number cannot exceed 20 characters.")
          return
        }

        const { message, sucess } = await updateInvoiceNumberForInvoice(id, invoiceNumber, vendorId)

        if (sucess) {
          toast.success(message)
        } else {
          toast.error(message)
        }
      }}
      className="flex w-full max-w-sm items-center gap-2"
    >
      <Label htmlFor={`${id}-target`}>Invoice:</Label>
      <Input
        id={`${id}-target`}
        defaultValue={inv}
        type="text"
        maxLength={20}
        minLength={1}
        className="hover:bg-input/30 text-left focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 border-transparent bg-secondary h-8 w-40 border shadow-none focus-visible:border dark:bg-transparent"
      />
    </form>

  )
}

export default EditInvoiceNumber