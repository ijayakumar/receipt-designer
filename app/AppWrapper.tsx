"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

export default function AppWrapper({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // Check if the current page is an auth page (login or register)
  const isAuthPage = pathname === "/login" || pathname === "/register"

  if (isAuthPage) {
    return (
        <>
          {children}
          <Toaster />
        </>
    )
  }

  return (
      <div className="flex h-screen">
        <Sidebar className={`border-r ${isSidebarCollapsed ? "w-16" : "w-64"}`} isCollapsed={isSidebarCollapsed} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex-1 overflow-auto p-4">{children}</main>
          <footer className="bg-gray-100 py-4 px-6">
            <div className="text-right">
              <p className="text-sm text-white bg-[#3366ff] inline-block px-2 py-1 rounded">
                Powered by Archery Technocrats
              </p>
            </div>
          </footer>
        </div>
        <Toaster />
      </div>
  )
}

