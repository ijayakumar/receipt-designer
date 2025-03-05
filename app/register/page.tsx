import type React from "react"
import AuthLayout from "../components/AuthLayout"
import RegisterForm from "../components/RegisterForm"

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage

