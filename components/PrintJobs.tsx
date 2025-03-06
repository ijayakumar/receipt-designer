"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { useToast } from "@/components/ui/use-toast"

interface PrintJob {
  _id: string
  jobId: string
  fileEvent: {
    fileName: string
    source: string
  }
  printJobData: {
    printJobName: string
    printFormatName: string
    printType: string
    printerHost: string
    sourceSystem: string
    user: string
    metaData: {
      priority: string
      department: string
    }
  }
  status: string
  createdAt: string
  updatedAt: string
}

const columns = [
  { key: "jobId", name: "Job ID", width: 100 },
  { key: "fileName", name: "File Name", width: 200 },
  { key: "source", name: "Source", width: 100 },
  { key: "printJobName", name: "Print Job Name", width: 150 },
  { key: "printFormatName", name: "Print Format Name", width: 150 },
  { key: "printType", name: "Print Type", width: 100 },
  { key: "printerHost", name: "Printer Host", width: 150 },
  { key: "sourceSystem", name: "Source System", width: 150 },
  { key: "user", name: "User", width: 100 },
  { key: "priority", name: "Priority", width: 100 },
  { key: "department", name: "Department", width: 100 },
  { key: "status", name: "Status", width: 100 },
  { key: "createdAt", name: "Created At", width: 150 },
  { key: "updatedAt", name: "Updated At", width: 150 },
]

const tabs = ["All Jobs", "Completed Jobs", "Failed Jobs"]

export default function PrintJobs() {
  const [data, setData] = useState<PrintJob[]>([])
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
      Object.fromEntries(columns.map((col) => [col.key, col.width])),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState("All Jobs")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchPrintJobs = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PRINT_API_URL || "http://localhost:4001"
      console.log("API URL:", apiUrl) // Log the API URL for debugging

      let url = `${apiUrl}/printjobs?page=${page}&limit=${limit}`
      if (currentTab === "Completed Jobs") {
        url += "&status=Completed"
      } else if (currentTab === "Failed Jobs") {
        url += "&status=Failed"
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }

      console.log("Fetching from URL:", url) // Log the full URL for debugging

      const response = await fetchWrapper(url)
      console.log("API Response:", response) // Log the API response for debugging

      setData(response.data)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Error fetching print jobs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch print jobs. Please try again.",
        variant: "destructive",
      })
    }
  }, [page, limit, currentTab, searchTerm, toast])

  useEffect(() => {
    fetchPrintJobs()
  }, [fetchPrintJobs])

  const startResize = useCallback(
      (column: string) => (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        const startX = e.clientX
        const startWidth = columnWidths[column]

        const handleMouseMove = (e: MouseEvent) => {
          const diff = e.clientX - startX
          const newWidth = Math.max(50, startWidth + diff)
          setColumnWidths((prev) => ({ ...prev, [column]: newWidth }))
        }

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      },
      [columnWidths],
  )

  const handleSearch = () => {
    setPage(1)
    fetchPrintJobs()
  }

  const getNestedValue = (obj: any, path: string): string => {
    const value = path.split(".").reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj)
    return value !== undefined ? String(value) : ""
  }

  const renderTable = (jobs: PrintJob[]) => (
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
          <tr>
            {columns.map((column) => (
                <th
                    key={column.key}
                    className="relative bg-gray-100 p-2 text-left font-semibold select-none"
                    style={{ width: `${columnWidths[column.key]}px`, minWidth: `${columnWidths[column.key]}px` }}
                >
                  {column.name}
                  <div
                      onMouseDown={startResize(column.key)}
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                  />
                </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {jobs.map((item) => (
              <tr key={item._id} className="border-b">
                {columns.map((column) => {
                  let value: string
                  switch (column.key) {
                    case "fileName":
                      value = getNestedValue(item, "fileEvent.fileName")
                      break
                    case "source":
                      value = getNestedValue(item, "fileEvent.source")
                      break
                    case "priority":
                      value = getNestedValue(item, "printJobData.metaData.priority")
                      break
                    case "department":
                      value = getNestedValue(item, "printJobData.metaData.department")
                      break
                    case "createdAt":
                    case "updatedAt":
                      value = new Date(getNestedValue(item, column.key)).toLocaleString()
                      break
                    default:
                      value = getNestedValue(item, `printJobData.${column.key}`) || getNestedValue(item, column.key)
                  }
                  return (
                      <td
                          key={column.key}
                          className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ maxWidth: `${columnWidths[column.key]}px` }}
                      >
                        {value}
                      </td>
                  )
                })}
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  )

  return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <Input
              placeholder="Search print jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-sm"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <Tabs defaultValue="All Jobs" className="w-full" onValueChange={(value) => setCurrentTab(value)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {tabs.map((tab) => (
                <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:bg-[#3366ff] data-[state=active]:text-white hover:bg-[#b3c6ff] hover:text-white"
                >
                  {tab}
                </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
              <TabsContent key={tab} value={tab}>
                {renderTable(data)}
              </TabsContent>
          ))}
        </Tabs>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="mr-2">Items per page:</span>
            <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
                className="border rounded p-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="mr-2">
              Previous
            </Button>
            <span className="mx-2">
            Page {page} of {totalPages}
          </span>
            <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="ml-2"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
  )
}

