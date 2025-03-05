import ReceiptDesigner from "../../components/ReceiptDesigner"
import PermissionGuard  from "@/app/components/PermissionGuard";

export default function DesignReceiptPage() {
  return (
    <div className="container mx-auto p-4">
        <PermissionGuard requiredPermission="receipt_management">
      <ReceiptDesigner />
            </PermissionGuard>
    </div>
  )
}

