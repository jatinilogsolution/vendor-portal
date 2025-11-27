
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { LrUpdateDialog } from "./_components/lr-update";
import { toast } from "sonner";
import { useTransition } from "react";

type ItemWithComponent = {
  title: string;
  desc: string;
  buttonTitle: string;
  component: React.ComponentType;
};

type ItemWithAction = {
  title: string;
  desc: string;
  buttonTitle: string;
  doIt: () => void | Promise<void>;
};

type GridItem = ItemWithComponent | ItemWithAction;

export default function BigButtonGrid() {
  const [isPending, startTransition] = useTransition();

  const items: GridItem[] = [
    {
      title: "LR Update",
      desc: "Update LR Details here....",
      buttonTitle: "Update LR",
      component: LrUpdateDialog,
    },
    {
      title: "Vendors Update",
      desc: "Manage and update vendor details.",
      buttonTitle: "Update Vendor Details",
      doIt: () => { toast.success("From Vendors Update") },
    },
    {
      title: "Lorry Refresh",
      desc: "Track all lorry call requests.",
      buttonTitle: "Refresh Lorries",
      doIt: () => { toast.success("From Lorry Refresh") },
    },
    {
      title: "POD Refresh",
      desc: "Import POD files and validate data.",
      buttonTitle: "Refresh Pod Upload",
      doIt: () => { toast.success("From POD Refresh") },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {items.map((item, idx) => {
        const Component = "component" in item ? item.component : null;
        const action = "doIt" in item ? item.doIt : undefined;

        return (
          <div key={idx} className="cursor-pointer">
            <Card className="p-4 shadow-md hover:shadow-lg rounded-lg transition-all">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>

                <p className="text-sm text-muted-foreground">{item.desc}</p>

                {Component ? (
                  <Component />
                ) : (
                  <Button

                    onClick={() => {
                      startTransition(() => {
                        action?.();
                      });
                    }}
                    disabled={isPending}
                  >
                    {item.buttonTitle}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
