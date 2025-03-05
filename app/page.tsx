"use client"
import PermissionGuard from "./components/PermissionGuard"

export default function Home() {
    return (
        <PermissionGuard requiredPermission="dashboard">
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p>Welcome to the Receipt Designer Dashboard</p>
                {/* Add more dashboard content here */}
            </div>
        </PermissionGuard>
    )
}

