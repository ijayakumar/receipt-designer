import type React from "react"
import Link from "next/link"

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
    <p className="text-xl mb-8">You are not authorized to view this page.</p>
    <Link href="/" className="text-blue-500 hover:underline">
        Return to Dashboard
    </Link>
    </div>
)
}

export default UnauthorizedPage

