export function NoInvoice() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-2xl border border-dashed border-primary p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          No Invoices Found
        </h1>
        <p className="text-muted-foreground text-sm">
          There are no invoices to display at the moment.
        </p>
      </div>
    </div>
  );
}
