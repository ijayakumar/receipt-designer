"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface PermissionGuardProps {
    requiredPermission: string
    children: React.ReactNode
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ requiredPermission, children }) => {
    const router = useRouter()
    const [hasPermission, setHasPermission] = useState(false)

    useEffect(() => {
        const checkPermission = () => {
            const storedPermissions = localStorage.getItem("permissions")
            if (storedPermissions) {
                const permissions = JSON.parse(storedPermissions)
                if (permissions.includes(requiredPermission)) {
                    setHasPermission(true)
                } else {
                    router.push("/unauthorized")
                }
            } else {
                router.push("/login")
            }
        }

        checkPermission()
    }, [requiredPermission, router])

    if (!hasPermission) {
        return null // or a loading spinner
    }

    return <>{children}</>
}

export default PermissionGuard

