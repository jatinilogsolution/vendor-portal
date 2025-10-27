function NoInvoice() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">No Invoices Found</h1>
                <p className="text-muted-foreground">There are no invoices to display at the moment.</p>
            </div>
        </div>
    )
}

export { NoInvoice }