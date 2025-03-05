import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans, Bree_Serif } from "next/font/google"
import "./globals.css"
import AppWrapper from "./AppWrapper"

const notoSans = Noto_Sans({
    subsets: ["latin"],
    display: "swap",
})

const breeSerif = Bree_Serif({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
})

export const metadata: Metadata = {
    title: "Receipt Designer",
    description: "Design and manage your receipts",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${notoSans.className} ${breeSerif.className}`}>
        <AppWrapper>{children}</AppWrapper>
        </body>
        </html>
    )
}

