"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import ReceiptPreview from "./ReceiptPreview"

export type ReceiptElement = {
  id: string
  type: "text" | "line" | "spacer" | "logo" | "qr" | "code128" | "code39" | "placeholder"
  content?: string
  align?: "left" | "center" | "right"
  logoUrl?: string
  position?: { x: number; y: number }
  font?: "serif" | "sans-serif" | "monospace"
  fontSize?: "small" | "medium" | "large"
  bold?: boolean
  italic?: boolean
  underline?: boolean
  line?: number
  qrValue?: string
  barcodeValue?: string
  placeholderType?: "text" | "logo" | "qr" | "code128" | "code39"
  metadata?: Record<string, unknown>
}

export default function ReceiptDesigner() {
  const { toast } = useToast()
  const [elements, setElements] = useState<ReceiptElement[]>([])
  const [currentElement, setCurrentElement] = useState<Omit<ReceiptElement, "id">>({
    type: "text",
    content: "",
    align: "left",
    font: "sans-serif",
    fontSize: "medium",
    bold: false,
    italic: false,
    underline: false,
    line: 1,
    placeholderType: "text",
    metadata: {},
  })
  const [dimensions, setDimensions] = useState({ width: 100, height: 300 }) // Updated default values
  const [formatName, setFormatName] = useState("")
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)

  const addElement = () => {
    if (currentElement.type === "text" && currentElement.content) {
      const words = currentElement.content.split(" ")
      if (words.length > dimensions.width) {
        alert(`Content exceeds maximum width of ${dimensions.width} words.`)
        return
      }
    }

    const newElement = {
      ...currentElement,
      id: Date.now().toString(),
    }
    setElements([...elements, newElement])
    setCurrentElement({
      type: "text",
      content: "",
      align: "left",
      font: "sans-serif",
      fontSize: "medium",
      bold: false,
      italic: false,
      underline: false,
      line: 1,
      placeholderType: "text",
      metadata: {},
    })
  }

  const removeElement = (id: string) => {
    setElements(elements.filter((element) => element.id !== id))
  }

  const handleSave = async () => {
    if (!formatName || formatName.length < 5) {
      toast({
        title: "Error",
        description: "Receipt format name must be at least 5 characters long.",
        variant: "destructive",
      })
      return
    }

    const formattedElements = elements.map((element) => {
      const formattedElement: any = {
        id: element.id,
        type: element.type,
        content: element.content || "",
        position: element.position,
        line: element.line,
      }

      if (element.type === "text" || (element.type === "placeholder" && element.placeholderType === "text")) {
        formattedElement.align = element.align
        formattedElement.font = element.font
        formattedElement.fontSize = element.fontSize
        formattedElement.bold = element.bold
        formattedElement.italic = element.italic
        formattedElement.underline = element.underline
      }

      if (element.type === "logo") {
        formattedElement.content = element.logoUrl
      }

      if (element.type === "qr") {
        formattedElement.content = element.qrValue
      }

      if (element.type === "code128" || element.type === "code39") {
        formattedElement.content = element.barcodeValue
      }

      if (element.type === "placeholder") {
        formattedElement.placeholderType = element.placeholderType
      }

      return formattedElement
    })

    const receiptData = {
      formatName,
      dimensions,
      elements: formattedElements,
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/main/receipt-management/design-your-receipt`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(receiptData),
          },
      )

      if (response.ok) {
        toast({
          title: "Success",
          description: "Receipt format is successfully saved",
          variant: "success",
        })
        // Reset the form
        setElements([])
        setFormatName("")
        setDimensions({ width: 100, height: 300 })
      } else {
        throw new Error("Failed to save receipt")
      }
    } catch (error) {
      console.error("Error saving receipt:", error)
      toast({
        title: "Error",
        description: "Failed to save receipt format",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setShowResetConfirmation(true)
  }

  const confirmReset = () => {
    setElements([])
    setFormatName("")
    setDimensions({ width: 100, height: 300 })
    setShowResetConfirmation(false)
  }

  const handleDimensionChange = (dimension: "width" | "height", value: number) => {
    let newValue = value
    if (dimension === "width") {
      newValue = Math.max(20, Math.min(100, value))
    } else {
      newValue = Math.max(20, Math.min(3000, value))
    }
    setDimensions((prev) => ({ ...prev, [dimension]: newValue }))
  }

  // Add this constant at the top of your component
  const SCALE_FACTOR = 2 / 3 // This will make the preview content 2/3 of its original size (i.e., reduced by 1/3)

  return (
      <React.Fragment>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <Label htmlFor="formatName">Receipt Format Name</Label>
              <Input
                  id="formatName"
                  value={formatName}
                  onChange={(e) => setFormatName(e.target.value)}
                  placeholder="Enter format name"
              />
            </div>
            <h3 className="text-lg font-semibold mb-4">Receipt Dimensions</h3>
            <div className="flex gap-4 mb-4">
              <div>
                <Label htmlFor="width">Width (mm)</Label>
                <Input
                    id="width"
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => handleDimensionChange("width", Number(e.target.value))}
                    min={20}
                    max={100}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (mm)</Label>
                <Input
                    id="height"
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => handleDimensionChange("height", Number(e.target.value))}
                    min={20}
                    max={3000}
                />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4">Add Receipt Elements</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="elementType">Element Type</Label>
                  <Select
                      value={currentElement.type}
                      onValueChange={(
                          value: "text" | "line" | "spacer" | "logo" | "qr" | "code128" | "code39" | "placeholder",
                      ) => setCurrentElement({ ...currentElement, type: value })}
                  >
                    <SelectTrigger id="elementType">
                      <SelectValue placeholder="Select element type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="spacer">Spacer</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="qr">QR Code</SelectItem>
                      <SelectItem value="code128">Code 128</SelectItem>
                      <SelectItem value="code39">Code 39</SelectItem>
                      <SelectItem value="placeholder">Placeholder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {currentElement.type === "placeholder" && (
                    <div className="flex-1">
                      <Label htmlFor="placeholderType">Placeholder Type</Label>
                      <Select
                          value={currentElement.placeholderType}
                          onValueChange={(value: "text" | "logo" | "qr" | "code128" | "code39") =>
                              setCurrentElement({ ...currentElement, placeholderType: value })
                          }
                      >
                        <SelectTrigger id="placeholderType">
                          <SelectValue placeholder="Select placeholder type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="logo">Logo</SelectItem>
                          <SelectItem value="qr">QR Code</SelectItem>
                          <SelectItem value="code128">Code 128</SelectItem>
                          <SelectItem value="code39">Code 39</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                )}
              </div>
              {(currentElement.type === "text" || currentElement.type === "line" || currentElement.type === "spacer") && (
                  <div>
                    <Label htmlFor="line">Line Number</Label>
                    <Input
                        id="line"
                        type="number"
                        min={1}
                        max={dimensions.height}
                        value={currentElement.line}
                        onChange={(e) => setCurrentElement({ ...currentElement, line: Number(e.target.value) })}
                    />
                  </div>
              )}
              {currentElement.type === "text" && (
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Input
                        id="content"
                        value={currentElement.content}
                        onChange={(e) => setCurrentElement({ ...currentElement, content: e.target.value })}
                        placeholder="Enter text content"
                    />
                  </div>
              )}
              {(currentElement.type === "text" ||
                  (currentElement.type === "placeholder" && currentElement.placeholderType === "text")) && (
                  <>
                    <div>
                      <Label htmlFor="align">Alignment</Label>
                      <Select
                          value={currentElement.align}
                          onValueChange={(value: "left" | "center" | "right") =>
                              setCurrentElement({ ...currentElement, align: value })
                          }
                      >
                        <SelectTrigger id="align">
                          <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="font">Font</Label>
                      <Select
                          value={currentElement.font}
                          onValueChange={(value: "serif" | "sans-serif" | "monospace") =>
                              setCurrentElement({ ...currentElement, font: value })
                          }
                      >
                        <SelectTrigger id="font">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="serif">Serif</SelectItem>
                          <SelectItem value="sans-serif">Sans-serif</SelectItem>
                          <SelectItem value="monospace">Monospace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select
                          value={currentElement.fontSize}
                          onValueChange={(value: "small" | "medium" | "large") =>
                              setCurrentElement({ ...currentElement, fontSize: value })
                          }
                      >
                        <SelectTrigger id="fontSize">
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="bold"
                          checked={currentElement.bold}
                          onCheckedChange={(checked) => setCurrentElement({ ...currentElement, bold: checked as boolean })}
                      />
                      <Label htmlFor="bold">Bold</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="italic"
                          checked={currentElement.italic}
                          onCheckedChange={(checked) => setCurrentElement({ ...currentElement, italic: checked as boolean })}
                      />
                      <Label htmlFor="italic">Italic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="underline"
                          checked={currentElement.underline}
                          onCheckedChange={(checked) =>
                              setCurrentElement({ ...currentElement, underline: checked as boolean })
                          }
                      />
                      <Label htmlFor="underline">Underline</Label>
                    </div>
                  </>
              )}
              {(currentElement.type === "logo" ||
                  currentElement.type === "qr" ||
                  currentElement.type === "code128" ||
                  currentElement.type === "code39" ||
                  currentElement.type === "placeholder") && (
                  <>
                    <div>
                      <Label htmlFor="position">Position (x,y)</Label>
                      <div className="flex gap-2">
                        <Input
                            id="positionX"
                            type="number"
                            value={currentElement.position?.x || 0}
                            onChange={(e) =>
                                setCurrentElement({
                                  ...currentElement,
                                  position: {
                                    x: Number(e.target.value),
                                    y: currentElement.position?.y || 0,
                                  },
                                })
                            }
                            placeholder="X position"
                        />
                        <Input
                            id="positionY"
                            type="number"
                            value={currentElement.position?.y || 0}
                            onChange={(e) =>
                                setCurrentElement({
                                  ...currentElement,
                                  position: {
                                    x: currentElement.position?.x || 0,
                                    y: Number(e.target.value),
                                  },
                                })
                            }
                            placeholder="Y position"
                        />
                      </div>
                    </div>
                  </>
              )}
              {currentElement.type === "logo" && (
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                        id="logoUrl"
                        value={currentElement.logoUrl || ""}
                        onChange={(e) => setCurrentElement({ ...currentElement, logoUrl: e.target.value })}
                        placeholder="Enter logo URL"
                    />
                  </div>
              )}
              {currentElement.type === "qr" && (
                  <div>
                    <Label htmlFor="qrValue">QR Code Value</Label>
                    <Input
                        id="qrValue"
                        value={currentElement.qrValue || ""}
                        onChange={(e) => setCurrentElement({ ...currentElement, qrValue: e.target.value })}
                        placeholder="Enter QR code value"
                    />
                  </div>
              )}
              {(currentElement.type === "code128" || currentElement.type === "code39") && (
                  <div>
                    <Label htmlFor="barcodeValue">Barcode Value</Label>
                    <Input
                        id="barcodeValue"
                        value={currentElement.barcodeValue || ""}
                        onChange={(e) => setCurrentElement({ ...currentElement, barcodeValue: e.target.value })}
                        placeholder={`Enter ${currentElement.type === "code128" ? "Code 128" : "Code 39"} value`}
                    />
                  </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <Button onClick={addElement} className="bg-[#3366ff] hover:bg-[#809fff] text-white">
                  Add Element
                </Button>
                <div className="space-x-2">
                  <Button onClick={handleSave} className="bg-[#3366ff] hover:bg-[#809fff] text-white">
                    Save
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Receipt Preview</h2>
            <p className="mb-2">
              Dimensions: {dimensions.width}mm x {dimensions.height}mm
            </p>
            <div
                className="border p-4 rounded-lg bg-white relative overflow-hidden"
                style={{
                  width: `${dimensions.width + 16}mm`,
                  height: `${dimensions.height + 16}mm`,
                  maxWidth: "100%",
                  maxHeight: "80vh",
                }}
            >
              <div
                  style={{
                    transform: `scale(${SCALE_FACTOR})`,
                    transformOrigin: "top left",
                    width: `${dimensions.width}mm`,
                    height: `${dimensions.height}mm`,
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                  }}
              >
                <ReceiptPreview elements={elements} dimensions={dimensions} removeElement={removeElement} />
              </div>
            </div>
          </div>
        </div>
        {showResetConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg">
                <p className="mb-4">This will reset the entire Receipt format. Do you want to continue?</p>
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setShowResetConfirmation(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={confirmReset}>Confirm</Button>
                </div>
              </div>
            </div>
        )}
      </React.Fragment>
  )
}

