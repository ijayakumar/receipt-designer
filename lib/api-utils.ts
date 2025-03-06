import { toast } from "@/components/ui/use-toast"

export async function handleApiResponse(response: Response) {
    if (response.status === 401) {
        // Token has expired or is invalid
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("permissions")
        toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
        })
        window.location.href = "/login"
        throw new Error("Unauthorized")
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "An error occurred")
    }

    return response.json()
}

export function getAuthHeader(): { Authorization: string } | Record<string, never> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

