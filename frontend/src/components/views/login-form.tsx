"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Package } from "lucide-react"
import { API } from "@/lib/API"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/useAuthContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const [formData, seFormData] = useState(
        {email:'', password:''}
    );
    
    const router = useRouter();
    const [[isAuthenticated, setIsAuthenticated], [permission, setPermission]] = useAuthContext()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(formData.email && formData.password){
            console.log('login formdata =>', formData);
            try{
                const response = await API.post(
                    '/auth/token/',
                    formData
                )
                console.log('response =>', response.data);
                localStorage.setItem('accessToken', response.data.access)
                localStorage.setItem('refreshToken', response.data.refresh)
                setIsAuthenticated(true)
                router.push('/dashboard')
            }catch(error){
                console.error(error)
            }
        }
    }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Lost & Found Account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(event)=> seFormData({...formData, email : event.target.value})}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    onChange={(event)=> seFormData({...formData, password : event.target.value})}
                    required 
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="#" className="underline underline-offset-4 text-blue-600">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-center bg-muted relative hidden md:flex">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-blue-300/60 blur-2xl" />
              </div>
              <Package className="relative h-12 w-12 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
