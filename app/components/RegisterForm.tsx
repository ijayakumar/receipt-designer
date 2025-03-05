"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const schema = z
    .object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#%&*\-_+=])[A-Za-z\d@!#%&*\-_+=]{8,}$/,
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
            ),
        confirmPassword: z.string(),
        roles: z.array(z.enum(["admin", "user"])).nonempty("At least one role must be selected"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type FormData = z.infer<typeof schema>

const RegisterForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        console.log("Component mounted")
    }, [])

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setSuccessMessage(null)
        setErrorMessage(null)

        try {
            console.log("Submitting data:", data)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const successMessage = "Registration successful!"
                setSuccessMessage(successMessage)
                console.log(successMessage)
                toast({
                    title: "Success",
                    description: successMessage,
                    variant: "success",
                })
                // Reset the form after successful registration
                reset()
            } else {
                const errorData = await response.json()
                const errorMessage = errorData.message || "Registration failed"
                setErrorMessage(errorMessage)
                console.error(errorMessage)
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                })
            }
        } catch (error) {
            const errorMessage = "Error during registration"
            setErrorMessage(errorMessage)
            console.error(errorMessage, error)
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register("username")} className="mt-1" />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
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
            <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1" />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
                <Label>Roles</Label>
                <div className="mt-1">
                    <label className="inline-flex items-center mr-4">
                        <input type="checkbox" {...register("roles")} value="admin" className="form-checkbox" />
                        <span className="ml-2">Admin</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="checkbox" {...register("roles")} value="user" className="form-checkbox" />
                        <span className="ml-2">User</span>
                    </label>
                </div>
                {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
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
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                    Log in
                </Link>
            </p>
        </form>
    )
}

export default RegisterForm

