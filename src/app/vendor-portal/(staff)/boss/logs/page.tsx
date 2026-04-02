import LogsClient from "@/components/modules/logs/logs-client"
import LogsStats from "@/components/modules/logs/logs-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"

export default async function BossLogsPage() {
    await requireVendorPortalSession([UserRoleEnum.BOSS])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Audit Logs"
                description="Review boss-visible actions across the system, including user delete and mark-as-deleted events."
            />

            <LogsStats scope="vendor" />

            <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-6">
                    <LogsClient scope="vendor" />
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                    <LogsClient viewMode="timeline" scope="vendor" />
                </TabsContent>
            </Tabs>
        </div>
    )
}
