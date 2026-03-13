import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import { getVpCategories, createVpCategory, updateVpCategoryStatus } from "../_actions/categories";
import CategoryManagementPage from "./_components/category-management-page";

export default async function VendorPortalAdminCategoriesPage() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);

  const categories = await getVpCategories();

  return (
    <VendorPortalPageShell
      title="Categories"
      description="Maintain top-level and sub-category hierarchy."
    >
      <CategoryManagementPage
        categories={categories}
        onCreate={createVpCategory}
        onUpdate={updateVpCategoryStatus}
      />
    </VendorPortalPageShell>
  );
}
