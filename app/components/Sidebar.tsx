"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  FileText,
  UserCircle,
  Settings,
  ChevronRight,
  PenLine,
  List,
  LogOut,
  Printer,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { fetchWrapper } from "@/lib/fetch-wrapper"

interface MenuItem {
  name: string
  icon: React.ElementType
  href: string
  permission?: string
  subItems?: Omit<MenuItem, "permission" | "subItems">[]
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", permission: "dashboard" },
  {
    name: "Receipt Management",
    icon: FileText,
    href: "/receipt-management",
    permission: "receipt_management",
    subItems: [
      { name: "Design your Receipt", icon: PenLine, href: "/receipt-management/design" },
      { name: "Designed Receipts", icon: List, href: "/receipt-management/designed-receipts" },
    ],
  },
  {
    name: "Print Jobs",
    icon: Printer,
    href: "/print-jobs",
    permission: "print_jobs",
  },
  { name: "Accounts", icon: UserCircle, href: "/accounts", permission: "accounts" },
  { name: "Settings", icon: Settings, href: "/settings", permission: "settings" },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
}

export function Sidebar({ className, isCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [userPermissions, setUserPermissions] = React.useState<string[]>([])
  const [userEmail, setUserEmail] = React.useState<string>("")
  const [username, setUsername] = React.useState<string>("")

  React.useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions")
    if (storedPermissions) {
      setUserPermissions(JSON.parse(storedPermissions))
    }

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserEmail(user.email || "")
      setUsername(user.username || "")
    }
  }, [])

  const filteredMenuItems = menuItems.filter((item) =>
      item.permission ? userPermissions.includes(item.permission) : true,
  )

  const handleLogout = async () => {
    try {
      await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
      })

      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("permissions")

      // Show success toast
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
        variant: "success",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if the API call fails, we should still clear local storage and redirect
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("permissions")
      router.push("/login")
    }
  }

  const getUserInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
      <div
          className={cn(
              "flex h-full flex-col justify-between bg-gray-100",
              isCollapsed ? "w-[67px]" : "w-[259px]",
              className,
          )}
      >
        <div>
          <div className="flex h-16 items-center">
            <Link
                href="/"
                className={cn("flex items-center w-full px-2", isCollapsed ? "justify-center" : "justify-start")}
            >
              <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-start pl-2")}>
                <img
                    src="https://5.imimg.com/data5/CV/NX/MY-7173666/archery-technocrats-private-limited.png"
                    alt="Logo"
                    className="h-8 w-auto"
                />
                {!isCollapsed && <span className="ml-4 text-lg font-semibold">Perfect Labeler</span>}
              </div>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
              {filteredMenuItems.map((item) => (
                  <React.Fragment key={item.name}>
                    {item.subItems ? (
                        <Collapsible
                            icon={item.icon}
                            name={item.name}
                            subItems={item.subItems}
                            isCollapsed={isCollapsed}
                            pathname={pathname}
                        />
                    ) : (
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                  href={item.href}
                                  className={cn(
                                      "flex items-center w-full py-2 px-3 rounded-md text-sm font-medium",
                                      isCollapsed ? "justify-center" : "justify-start",
                                      pathname === item.href
                                          ? "bg-[#3366ff] text-white hover:bg-[#3366ff]"
                                          : "text-gray-700 hover:bg-[#b3c6ff] hover:text-white",
                                  )}
                              >
                                <item.icon style={{ width: "24px", height: "24px" }} className={!isCollapsed ? "mr-2" : ""} />
                                {!isCollapsed && <span>{item.name}</span>}
                              </Link>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                          </Tooltip>
                        </TooltipProvider>
                    )}
                  </React.Fragment>
              ))}
            </nav>
          </ScrollArea>
        </div>
        <div className="p-2">
          {isCollapsed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="w-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder-avatar.jpg" alt={username} />
                        <AvatarFallback className="bg-[#3366ff] text-white">{getUserInitials(username)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[300px] break-words">
                    <p>{userEmail}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 px-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder-avatar.jpg" alt={username} />
                        <AvatarFallback className="bg-[#3366ff] text-white">{getUserInitials(username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{username}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
                              <LogOut style={{ width: "20px", height: "20px" }} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="end">
                            Logout
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="max-w-[300px] break-words">
                    <p>{userEmail}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          )}
        </div>
      </div>
  )
}

interface CollapsibleProps {
  icon: React.ElementType
  name: string
  subItems: { name: string; icon: React.ElementType; href: string }[]
  isCollapsed: boolean
  pathname: string
}

function Collapsible({ icon: Icon, name, subItems, isCollapsed, pathname }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (subItems.some((item) => item.href === pathname)) {
      setIsOpen(true)
    }
  }, [pathname, subItems])

  return (
      <div className="grid gap-1">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                      "w-full py-2 px-3 text-sm font-medium",
                      isCollapsed ? "justify-center" : "justify-start",
                      isOpen
                          ? "bg-[#3366ff] text-white hover:bg-[#3366ff]"
                          : "text-gray-700 hover:bg-[#b3c6ff] hover:text-white",
                  )}
                  onClick={() => !isCollapsed && setIsOpen(!isOpen)}
              >
                <Icon style={{ width: "24px", height: "24px" }} className={!isCollapsed ? "mr-2" : ""} />
                {!isCollapsed && (
                    <>
                      <span>{name}</span>
                      <ChevronRight
                          style={{ width: "20px", height: "20px" }}
                          className={cn("ml-auto transition-transform", isOpen && "rotate-90")}
                      />
                    </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">{name}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        {isOpen && !isCollapsed && (
            <div className="grid gap-1 pl-6">
              {subItems.map((subItem) => (
                  <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                          "flex items-center py-2 px-3 rounded-md text-sm font-medium",
                          pathname === subItem.href
                              ? "bg-[#3366ff] text-white hover:bg-[#3366ff]"
                              : "text-gray-700 hover:bg-[#b3c6ff] hover:text-white",
                      )}
                  >
                    <subItem.icon style={{ width: "24px", height: "24px" }} className="mr-2" />
                    {subItem.name}
                  </Link>
              ))}
            </div>
        )}
      </div>
  )
}

