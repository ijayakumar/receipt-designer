import { DesignedReceipts } from "../../components/DesignedReceipts"
import PermissionGuard from "@/app/components/PermissionGuard";

export default function DesignedReceiptsPage() {
  return (
    <div className="container mx-auto p-4">
        <PermissionGuard requiredPermission="receipt_management">
      <DesignedReceipts />
            </PermissionGuard>
    </div>
  )
}

