import PermissionGuard from "@/app/components/PermissionGuard";
export default function AccountsPage() {
  return (
    <div className="container mx-auto p-4">
        <PermissionGuard requiredPermission="accounts">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <p>Manage your accounts here</p>
        </PermissionGuard>
    </div>
  )
}

