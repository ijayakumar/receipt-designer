import type React from "react"
import AuthLayout from "../components/AuthLayout"
import LoginForm from "../components/LoginForm"

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage

