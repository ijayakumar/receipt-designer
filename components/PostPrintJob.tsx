"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const tabs = ["All", "Success", "Failed", "In-Progress"]

interface PrintJob {
  printId: string
  fileName: string
  fileType: string
  sourceSystem: string
  printFormat: string
  user: string
  date: string
  time: string
  printerIpPort: string
  priority: string
}

const initialData: PrintJob[] = [
  {
    printId: "POST001",
    fileName: "receipt_data.xml",
    fileType: "XML",
    sourceSystem: "POS",
    printFormat: "Receipt-Thermal-001",
    user: "Alice Johnson",
    date: "2025-02-06",
    time: "12:15:00",
    printerIpPort: "192.168.1.102:9100",
    priority: "High",
  },
  {
    printId: "POST002",
    fileName: "shipping_label.json",
    fileType: "JSON",
    sourceSystem: "WMS",
    printFormat: "Label-4x6-002",
    user: "Bob Williams",
    date: "2025-02-06",
    time: "13:30:00",
    printerIpPort: "192.168.1.103:9100",
    priority: "Low",
  },
]

const columns = [
  { key: "printId", name: "Print ID", width: 100 },
  { key: "fileName", name: "File Name", width: 200 },
  { key: "fileType", name: "File Type", width: 100 },
  { key: "sourceSystem", name: "Source System", width: 150 },
  { key: "printFormat", name: "Print Format", width: 150 },
  { key: "user", name: "User", width: 150 },
  { key: "dateTime", name: "Date/Time", width: 150 },
  { key: "printerIpPort", name: "Printer IP/Port", width: 150 },
  { key: "priority", name: "Priority", width: 100 },
  { key: "viewPrint", name: "View Print", width: 100 },
]

export default function PostPrintJob() {
  const [data] = useState<PrintJob[]>(initialData)
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    Object.fromEntries(columns.map((col) => [col.key, col.width])),
  )

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

  return (
    <Tabs defaultValue="All" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
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
          <div className="overflow-x-auto">
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
                {data.map((item) => (
                  <tr key={item.printId} className="border-b">
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.printId}px` }}
                    >
                      {item.printId}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.fileName}px` }}
                    >
                      {item.fileName}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.fileType}px` }}
                    >
                      {item.fileType}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.sourceSystem}px` }}
                    >
                      {item.sourceSystem}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.printFormat}px` }}
                    >
                      {item.printFormat}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.user}px` }}
                    >
                      {item.user}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.dateTime}px` }}
                    >
                      <div>{item.date}</div>
                      <div>{item.time}</div>
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.printerIpPort}px` }}
                    >
                      {item.printerIpPort}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.priority}px` }}
                    >
                      {item.priority}
                    </td>
                    <td
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ maxWidth: `${columnWidths.viewPrint}px` }}
                    >
                      <Button variant="outline" size="sm" className="hover:bg-[#b3c6ff] hover:text-white">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

