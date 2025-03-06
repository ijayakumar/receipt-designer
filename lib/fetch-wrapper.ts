import { handleApiResponse, getAuthHeader } from "./api-utils"

export async function fetchWrapper(url: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers)
    const authHeader = getAuthHeader()

    Object.entries(authHeader).forEach(([key, value]) => {
        headers.append(key, value)
    })

    const response = await fetch(url, { ...options, headers })
    return handleApiResponse(response)
}

