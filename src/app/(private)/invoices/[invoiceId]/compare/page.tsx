import { getCustomSession } from '@/actions/auth.action';
import { UserRoleEnum } from '@/utils/constant';
import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';
import { FileSpreadsheet } from 'lucide-react';
import { InvoiceHeader } from '../../_component/compare/invoice-header';
import { LRRequestsTable } from '../../_component/invoice/LRRequestsTable';

const getApiBaseUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
        throw new Error("Missing API base URL configuration");
    }

    return baseUrl;
};

const fetchInvoiceComparison = async (invoiceId: string) => {
    const requestHeaders = await headers();
    const cookie = requestHeaders.get("cookie");

    const res = await fetch(
        new URL(`/api/invoices/compare/${invoiceId}`, getApiBaseUrl()),
        {
            cache: "no-store",
            headers: cookie ? { cookie } : undefined,
        }
    );

    const contentType = res.headers.get("content-type") ?? "";
    const text = await res.text();

    if (contentType.includes("text/html")) {
        throw new Error("Invoice compare API returned HTML instead of JSON. The request was likely redirected before reaching the API.");
    }

    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch invoice details");
    }

    return data;
};

const page = async ({ params }: { params: Promise<{ invoiceId: string }> }) => {
    const session = await getCustomSession();

    if (session.user.role !== UserRoleEnum.BOSS) {
        forbidden();
    }

    const { invoiceId } = await params;

    const data = await fetchInvoiceComparison(invoiceId);


    return (
        <div className="bg-background">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-1 pb-4">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="text-xl font-bold text-foreground">
                                Invoice Comparison
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Cost Analysis & Variance Tracking
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-4">
                <InvoiceHeader invoice={data} />

                <LRRequestsTable requests={data} />


            </main>
        </div>
    );
};

export default page;
