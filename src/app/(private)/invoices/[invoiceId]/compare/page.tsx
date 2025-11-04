import { getCustomSession } from '@/actions/auth.action';
import { signOut } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import { UserRoleEnum } from '@/utils/constant';
import { router } from 'better-auth/api';
import { FileSpreadsheet } from 'lucide-react';
import { forbidden, redirect } from 'next/navigation';
import React from 'react'
import { InvoiceHeader } from '../../_component/compare/invoice-header';
import { LRRequestsTable } from '../../_component/compare/lr-request-table';

const page = async ({ params }: { params: Promise<{ invoiceId: string }> }) => {


    const session = await getCustomSession();

    if (session.user.role !== UserRoleEnum.BOSS && session.user.role !== UserRoleEnum.TADMIN) {
        forbidden()
    }

    const { invoiceId } = await params;


    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId
        },
        include: {
            LRRequest: true,
            vendor: true
        }
    })
    return (

        <div className=" bg-background">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-1 pb-4 ">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Invoice Comparison</h1>
                            <p className="text-xs text-muted-foreground">Cost Analysis & Variance Tracking</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-4">
                <InvoiceHeader invoice={data as any} />
                <LRRequestsTable requests={data as any} />
            </main>
        </div>
    )
}

export default page