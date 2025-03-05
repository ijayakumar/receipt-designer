import Image from "next/image"
import type { ReceiptElement } from "./ReceiptDesigner"
import { Button } from "@/components/ui/button"
import { X, Type, ImageIcon, QrCode, Barcode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useBarcode } from "@createnextapp/react-barcode"

interface ReceiptPreviewProps {
    elements: ReceiptElement[]
    dimensions: { width: number; height: number }
    removeElement: (id: string) => void
}

export default function ReceiptPreview({ elements, dimensions, removeElement }: ReceiptPreviewProps) {
    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${dimensions.width}, 1fr)`,
        gridTemplateRows: `repeat(${dimensions.height}, 1fr)`,
        width: `${dimensions.width * 10}px`,
        height: `${dimensions.height * 10}px`,
        position: "relative" as const,
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
    }

    return (
        <div className="border p-4 bg-white text-black font-sans text-sm rounded-lg" style={gridStyle}>
            {elements.map((element) => {
                if (!element || typeof element !== "object") return null

                switch (element.type) {
                    case "text":
                        return (
                            <div key={element.id} className="col-span-full relative" style={{ gridRow: element.line }}>
                                <p
                                    className={`
                    ${element.align === "center" ? "text-center" : element.align === "right" ? "text-right" : "text-left"}
                    ${element.font === "serif" ? "font-serif" : element.font === "monospace" ? "font-mono" : "font-sans"}
                    ${element.fontSize === "small" ? "text-xs" : element.fontSize === "large" ? "text-lg" : "text-base"}
                    ${element.bold ? "font-bold" : ""}
                    ${element.italic ? "italic" : ""}
                    ${element.underline ? "underline" : ""}
                    truncate
                  `}
                                >
                                    {element.content}
                                </p>
                                <RemoveButton removeElement={removeElement} id={element.id} />
                            </div>
                        )
                    case "line":
                        return (
                            <div key={element.id} className="col-span-full relative" style={{ gridRow: element.line }}>
                                <hr className="border-t border-gray-300 my-2" />
                                <RemoveButton removeElement={removeElement} id={element.id} />
                            </div>
                        )
                    case "spacer":
                        return (
                            <div key={element.id} className="col-span-full relative" style={{ gridRow: element.line }}>
                                <div className="h-4"></div>
                                <RemoveButton removeElement={removeElement} id={element.id} />
                            </div>
                        )
                    case "logo":
                        return (
                            <div
                                key={element.id}
                                className="absolute"
                                style={{
                                    left: `${(element.position?.x || 0) * 10}px`,
                                    top: `${(element.position?.y || 0) * 10}px`,
                                }}
                            >
                                <Image
                                    src={element.logoUrl || element.content || "/placeholder.svg"}
                                    alt="Receipt Logo"
                                    width={50}
                                    height={50}
                                    className="max-w-full h-auto"
                                />
                                <RemoveButton removeElement={removeElement} id={element.id} />
                            </div>
                        )
                    case "qr":
                        return (
                            <div
                                key={element.id}
                                className="absolute"
                                style={{
                                    left: `${(element.position?.x || 0) * 10}px`,
                                    top: `${(element.position?.y || 0) * 10}px`,
                                }}
                            >
                                <QRCodeSVG value={element.qrValue || element.content || ""} size={50} />
                                <RemoveButton removeElement={removeElement} id={element.id} />
                            </div>
                        )
                    case "code128":
                    case "code39":
                        return <BarcodeElement key={element.id} element={element} removeElement={removeElement} />
                    case "placeholder":
                        return (
                            <div
                                key={element.id}
                                className="absolute border-2 border-dashed border-gray-400 p-2 rounded flex items-center justify-center"
                                style={{
                                    left: `${(element.position?.x || 0) * 10}px`,
                                    top: `${(element.position?.y || 0) * 10}px`,
                                    width: "60px",
                                    height: "60px",
                                }}
                            >
                                {element.placeholderType === "text" && <Type className="w-6 h-6 text-gray-500" />}
                                {element.placeholderType === "logo" && <ImageIcon className="w-6 h-6 text-gray-500" />}
                                {element.placeholderType === "qr" && <QrCode className="w-6 h-6 text-gray-500" />}
                                {(element.placeholderType === "code128" || element.placeholderType === "code39") && (
                                    <Barcode className="w-6 h-6 text-gray-500" />
                                )}
                                <RemoveButton removeElement={removeElement} id={element.id} />
                            </div>
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}

function BarcodeElement({ element, removeElement }: { element: ReceiptElement; removeElement: (id: string) => void }) {
    const { inputRef } = useBarcode({
        value: element.barcodeValue || element.content || "",
        options: {
            format: element.type === "code128" ? "CODE128" : "CODE39",
            width: 2,
            height: 50,
            displayValue: false,
        },
    })

    return (
        <div
            className="absolute"
            style={{
                left: `${(element.position?.x || 0) * 10}px`,
                top: `${(element.position?.y || 0) * 10}px`,
            }}
        >
            <svg ref={inputRef} />
            <RemoveButton removeElement={removeElement} id={element.id} />
        </div>
    )
}

function RemoveButton({ removeElement, id }: { removeElement: (id: string) => void; id: string }) {
    return (
        <Button variant="ghost" size="icon" className="absolute -right-2 -top-2" onClick={() => removeElement(id)}>
            <X className="h-4 w-4" />
        </Button>
    )
}

