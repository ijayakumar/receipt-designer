import type React from "react"
import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-end relative">
      <Image src="/perfect-labeler1_enhanced.jpeg" alt="3D Printer Background" layout="fill" objectFit="cover" quality={100} />
      <div className="z-10 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-96 mr-16">{children}</div>
    </div>
  )
}

export default AuthLayout

