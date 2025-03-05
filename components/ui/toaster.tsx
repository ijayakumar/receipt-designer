"use client"

import { useEffect, useState } from "react"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToastStore } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const [isMounted, setIsMounted] = useState(false)
  const { toasts } = useToastStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
      <ToastProvider>
        {toasts.map(({ id, title, description, variant, className, ...props }) => (
            <Toast
                key={id}
                {...props}
                className={cn(
                    "top-0 right-0",
                    {
                      "bg-green-50 border-green-200 text-green-800": variant === "success",
                      "bg-red-50 border-red-200 text-red-800": variant === "destructive",
                    },
                    className,
                )}
            >
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              <ToastClose />
            </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
  )
}

