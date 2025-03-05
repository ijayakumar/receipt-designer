"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ViewReceiptModal } from "./ViewReceiptModal"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ReceiptData = {
  _id: string
  formatName: string
  dimensions: { width: number; height: number }
  elements: any[]
  createdAt: string
  updatedAt: string
}

export function DesignedReceipts() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/main/receipt-management/designed-receipts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data.formats)) {
          setReceipts(data.formats)
        } else {
          throw new Error("Received data is not in the expected format")
        }
      } else {
        throw new Error("Failed to fetch receipts")
      }
    } catch (error) {
      console.error("Error fetching receipts:", error)
      setError("Failed to fetch designed receipts. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to fetch designed receipts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/main/receipt-management/designed-receipts/${deleteId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
        )
        if (response.ok) {
          setReceipts(receipts.filter((receipt) => receipt._id !== deleteId))
          toast({
            title: "Success",
            description: "Receipt format has been deleted",
            variant: "default",
          })
        } else {
          throw new Error("Failed to delete receipt")
        }
      } catch (error) {
        console.error("Error deleting receipt:", error)
        toast({
          title: "Error",
          description: "Failed to delete receipt format",
          variant: "destructive",
        })
      } finally {
        setDeleteId(null)
        setIsDeleteDialogOpen(false)
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Designed Receipts</h2>
        {receipts.length === 0 ? (
            <p>No designed receipts found.</p>
        ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt Format Name</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                    <TableRow key={receipt._id}>
                      <TableCell>{receipt.formatName}</TableCell>
                      <TableCell>{`${receipt.dimensions.width} x ${receipt.dimensions.height}`}</TableCell>
                      <TableCell>{new Date(receipt.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button
                              onClick={() => setSelectedReceipt(receipt)}
                              className="bg-[#3366ff] hover:bg-[#809fff] text-white"
                          >
                            View
                          </Button>
                          <Button onClick={() => handleDelete(receipt._id)} variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
        )}
        {selectedReceipt && <ViewReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>Do you want to delete the designed receipt?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

