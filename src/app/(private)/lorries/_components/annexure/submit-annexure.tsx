// "use client"
// import { Button } from '@/components/ui/button'
// import { Spinner } from '@/components/ui/shadcn-io/spinner'
// import React from 'react'

// const SubmitAnnexure = ({ annexureId }: {
//     annexureId: string,

// }) => {
//     return (
//         <Button variant={"secondary"}>
//             <Spinner />
//             {annexureId}
//         </Button>
//     )
// }

// export default SubmitAnnexure

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";

export default function SubmitAnnexure({ annexureId }: { annexureId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
       const res = await fetch("/api/lorries/annexures/submit", {
        method: "POST",
        body: JSON.stringify({ annexureId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success(`Invoice Generated: ${data.invoice.refernceNumber}`);
    } catch (err) {
      toast.error("Unexpected error while submitting annexure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      disabled={loading}
      onClick={handleSubmit}
      className="flex items-center gap-2"
    >
      {loading && <Spinner />}
      Submit Annexure
    </Button>
  );
}
