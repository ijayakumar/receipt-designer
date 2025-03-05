"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"

interface HeaderProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Header({ isCollapsed, onToggle }: HeaderProps) {
  const pathname = usePathname()

  const getHeaderText = () => {
    const parts = []
    if (pathname === "/") {
      return "Dashboard"
    }

    if (pathname.startsWith("/receipt-management")) {
      parts.push("Receipt Management")
      if (pathname === "/receipt-management/design") {
        parts.push("Design Your Receipt")
      } else if (pathname === "/receipt-management/designed-receipts") {
        parts.push("Designed Receipts")
      }
    } else if (pathname.startsWith("/print-jobs")) {
      return "Print Jobs"
    } else if (pathname === "/accounts") {
      return "Accounts"
    } else if (pathname === "/settings") {
      return "Settings"
    }
    return parts.join(" > ")
  }

  return (
      <header className="bg-[#3366ff] py-4 px-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={onToggle} className="mr-4 text-white hover:bg-[#809fff]">
          <PanelLeft style={{ width: isCollapsed ? "20px" : "24px", height: isCollapsed ? "20px" : "24px" }} />
        </Button>
        <h1 className="text-2xl font-bold text-white font-bree-serif">{getHeaderText()}</h1>
      </header>
  )
}

