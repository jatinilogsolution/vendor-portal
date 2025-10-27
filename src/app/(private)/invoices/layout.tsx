import { InvoiceProvider } from '@/components/modules/invoice-context'
import React from 'react'

const InvoiceLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <InvoiceProvider>
            {children}
        </InvoiceProvider>
    )
}

export default InvoiceLayout