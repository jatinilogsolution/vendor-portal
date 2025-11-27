import { getCustomSession } from '@/actions/auth.action';
import Hero from '@/components/modules/hero';
import { createLog } from '@/services/logging';
import React from 'react';

const page = async () => {
  const session = await getCustomSession()

  // Dummy Invoice Data
  const invoice = {
    id: "inv_12345",
    referenceNumber: "REF-987654",
    amount: 12000,
    status: "PENDING",
    customerName: "Dummy Customer",
    createdAt: new Date(),
  };

  // Create Log
  console.log(JSON.stringify(session, null, 2))
  await createLog({
    userId: session.user.id,
    vendorId: session.user.vendorId || null,
    action: "DELETED",
    model: "LR",
    recordId: invoice.id,
    newData: invoice,
    description: `Invoice ${invoice.referenceNumber ?? invoice.id} DELETED`,
  });

  // await PODIMPORT();

  return (
    <>
      <Hero />
    </>
  );
};

export default page;
