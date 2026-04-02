// app/logs/page.tsx
import LogsClient from "@/components/modules/logs/logs-client";
import LogsStats from "@/components/modules/logs/logs-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { redirect } from "next/navigation";

export default async function LosgPage() {
  const { user } = await getCustomSession();

  if (user.role !== UserRoleEnum.BOSS) {
    redirect("/forbidden");
  }

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track all user actions and system changes across the application
        </p>
      </div>

      <LogsStats scope="transport" />

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <LogsClient scope="transport" />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <LogsClient viewMode="timeline" scope="transport" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
