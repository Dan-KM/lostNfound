import { LoginForm } from "@/components/uix/login-form"
import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <div className="bg-muted w-full flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
      <Link to='/dashboard'>dashboard</Link>
    </div>
  )
}
