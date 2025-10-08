// "use client";

// import React, { useState } from "react";
// import { Invoice } from "../_component/invoice";
// import { useParams } from "next/navigation";
// import { InvoiceAddOnSheet } from "../_component/edit-sheet";

// const InvoiceIdPage = () => {
 


//   const params = useParams<{ invoiceId: string }>();
//   const invoiceId = params.invoiceId;

//   return (
//     <div className="relative">

// <div className="absolute right-10 top-4 ">

//       <InvoiceAddOnSheet invoiceId={invoiceId} />
// </div>

//       <Invoice id={invoiceId} />
//     </div>
//   );
// };

// export default InvoiceIdPage;

"use client"
import { Invoice } from "../_component/invoice"
import { useParams } from "next/navigation"
import { InvoiceAddOnSheet } from "../_component/edit-sheet"

const InvoiceIdPage = () => {
  const params = useParams<{ invoiceId: string }>()
  const invoiceId = params.invoiceId

  return (
    <div className="relative p-2 md:p-4">
      <div className="absolute right-4 top-4">
        <InvoiceAddOnSheet invoiceId={invoiceId} />
      </div>
      <Invoice id={invoiceId} />
    </div>
  )
}

export default InvoiceIdPage

 
