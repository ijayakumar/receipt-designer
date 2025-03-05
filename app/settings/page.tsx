import PermissionGuard from "@/app/components/PermissionGuard";
export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4">
        <PermissionGuard requiredPermission="settings">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Adjust your settings here</p>
        </PermissionGuard>
    </div>
  )
}

