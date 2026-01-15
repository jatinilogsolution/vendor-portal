// app/logs/page.tsx
import LogsClient from "@/components/modules/logs/logs-client";
import LogsStats from "@/components/modules/logs/logs-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LosgPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track all user actions and system changes across the application
        </p>
      </div>

      <LogsStats />

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <LogsClient />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <LogsClient viewMode="timeline" />
        </TabsContent>
      </Tabs>
    </div>
  );
}