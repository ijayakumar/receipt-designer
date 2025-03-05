"use client"
import PermissionGuard from "../components/PermissionGuard"

export default function ReceiptManagementPage() {
    return (
        <PermissionGuard requiredPermission="receipt_management">
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Receipt Management</h1>
                {/* Add receipt management content here */}
            </div>
        </PermissionGuard>
    )
}

