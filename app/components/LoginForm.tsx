"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

interface LoginResponse {
    message: string
    user: {
        _id: string
        username: string
        email: string
        roles: Array<{
            _id: string
            name: string
            permissions: string[]
        }>
    }
    token: string
}

const LoginForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const router = useRouter()

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setSuccessMessage(null)
        setErrorMessage(null)

        try {
            const response = await fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData: LoginResponse = await response.json()
                const { token, user } = responseData

                // Store token, user information, and permissions
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))

                // Extract and store permissions
                const permissions = user.roles.flatMap((role) => role.permissions)
                localStorage.setItem("permissions", JSON.stringify(permissions))

                setSuccessMessage("Login successful!")
                toast({
                    title: "Success",
                    description: "Login successful!",
                    variant: "success",
                })

                // Redirect to home page after a short delay
                setTimeout(() => {
                    router.push("/")
                }, 1500)
            } else {
                const errorData = await response.json()
                setErrorMessage(errorData.message || "Login failed")
                toast({
                    title: "Error",
                    description: errorData.message || "Login failed",
                    variant: "destructive",
                })
            }
        } catch (error) {
            setErrorMessage("An error occurred during login")
            toast({
                title: "Error",
                description: "An error occurred during login",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} className="mt-1" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} className="mt-1" />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
            {successMessage && (
                <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}
            {errorMessage && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}
            <p className="text-center mt-4">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-500 hover:underline">
                    Register
                </Link>
            </p>
        </form>
    )
}

export default LoginForm

