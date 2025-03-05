"use client"

import Link from "next/link"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils" // Add this import

interface SidebarContext {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const SidebarContext = createContext<SidebarContext | null>(null)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(false)

  return <SidebarContext.Provider value={{ expanded, setExpanded }}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === null) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const Sidebar = ({
                          children,
                          expanded,
                          className,
                        }: {
  children: React.ReactNode
  expanded: boolean
  className?: string
}) => {
  return (
      <aside className={cn("flex flex-col h-full", className)} style={{ width: expanded ? 250 : 60 }}>
        {children}
      </aside>
  )
}

export const SidebarHeader = ({ children }: { children: React.ReactNode }) => {
  return <header className="flex items-center justify-between p-4">{children}</header>
}

export const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 overflow-y-auto">{children}</div>
}

export const SidebarFooter = ({ children }: { children: React.ReactNode }) => {
  return <footer className="p-4">{children}</footer>
}

export const SidebarMenu = ({ children }: { children: React.ReactNode }) => {
  return <nav className="p-4">{children}</nav>
}

export const SidebarMenuItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="mb-2">{children}</li>
}

export const SidebarMenuItemButton = ({ children }: { children: React.ReactNode }) => {
  return <button className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded">{children}</button>
}

export const SidebarMenuItemLink = ({
                                      children,
                                      active,
                                      href,
                                    }: { children: React.ReactNode; active: boolean; href: string }) => {
  return (
      <Link
          href={href}
          className={cn("w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded", active && "bg-gray-200")}
      >
        {children}
      </Link>
  )
}

export const SidebarMenuSub = ({ children }: { children: React.ReactNode }) => {
  return <ul className="ml-4">{children}</ul>
}

export const SidebarMenuSubItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="mb-2">{children}</li>
}

export const SidebarMenuSubItemButton = ({ children }: { children: React.ReactNode }) => {
  return <button className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded">{children}</button>
}

export const SidebarMenuSubItemLink = ({
                                         children,
                                         active,
                                         href,
                                       }: { children: React.ReactNode; active: boolean; href: string }) => {
  return (
      <Link
          href={href}
          className={cn("w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded", active && "bg-gray-200")}
      >
        {children}
      </Link>
  )
}

export const SidebarTrigger = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  return <button onClick={onClick}>{children}</button>
}

