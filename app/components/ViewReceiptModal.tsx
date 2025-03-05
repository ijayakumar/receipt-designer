import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReceiptPreview from "./ReceiptPreview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ReceiptData = {
  formatName: string
  dimensions: { width: number; height: number }
  elements: any[]
}

type ViewReceiptModalProps = {
  receipt: ReceiptData
  onClose: () => void
}

export function ViewReceiptModal({ receipt, onClose }: ViewReceiptModalProps) {
  const isValidReceipt =
      receipt &&
      typeof receipt.formatName === "string" &&
      typeof receipt.dimensions?.width === "number" &&
      typeof receipt.dimensions?.height === "number" &&
      Array.isArray(receipt.elements)

  return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{receipt.formatName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isValidReceipt ? (
                <ReceiptPreview elements={receipt.elements} dimensions={receipt.dimensions} removeElement={() => {}} />
            ) : (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Unable to display the receipt. The receipt data is invalid or corrupted.
                  </AlertDescription>
                </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>
  )
}

