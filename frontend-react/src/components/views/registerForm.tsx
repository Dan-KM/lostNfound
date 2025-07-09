import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package } from "lucide-react"
import { API } from "@/lib/API"
import { useState } from "react"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const [formData, seFormData] = useState({
        first_name: '', 
        last_name:'', 
        email:'', 
        password:'', 
        user_image : null
    });

    
    const [confirm_password, setConfirm_Password] = useState<string>()
    const [passwordMatch, setPasswordMatch] = useState(
        formData.password === confirm_password
    )
    
    const [error, setError] = useState<String>()

    // const router = useRouter();
    const navigate = useNavigate();

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     if (!passwordMatch) {
    //         setError("Passwords don't match");
    //         return;
    //     }
    //     else{
    //         setError("");
    //     }
        
    //     const { first_name, last_name, email, password } = formData;
        
    //     console.log('form data ', formData)

    //     if (!first_name || !last_name || !email || !password) {
    //         setError("All fields are required");
    //         return;
    //     }

    //     console.log("login formdata =>", formData);

    //     try {
    //         const response = await API.post("/auth/register/", formData);
    //         console.log("response =>", response.data);
    //         router.push("/auth/login");
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!passwordMatch) {
          setError("Passwords don't match");
          return;
      }
      else {
          setError("");
      }
      
      const { first_name, last_name, email, password } = formData;
      
      if (!first_name || !last_name || !email || !password) {
          setError("All fields are required");
          return;
      }

      try {
          console.log("Sending data:", formData);  // Add this line
          const response = await API.post("/auth/register/", formData);
          // const response = await API.post("/auth/register/", JSON.stringify(formData));
          console.log("Response:", response);  // Add this line
        //   router.push("/auth/login");
        navigate('/auth/login', { replace: true });
      } catch (error) {
          console.error("Full error:", error);  // Enhanced error logging
          if (axios.isAxiosError(error)) {
              console.error("Error response:", error.response?.data);
              setError(error.response?.data?.message || "Registration failed");
          } else {
              setError("An unexpected error occurred");
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
                <h1 className="text-2xl font-bold">Welcome to Lost & Found</h1>
                <p className="text-muted-foreground text-balance">
                  Create an Account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="e.g., Kevin" 
                  onChange={(event)=> seFormData({...formData, first_name : event.target.value})}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="e.g., Otieno" 
                  onChange={(event)=> seFormData({...formData, last_name : event.target.value})}
                  required
                />
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
                </div>
                <Input 
                    id="password" 
                    type="password" 
                     onChange={(event) => {
                        seFormData({ ...formData, password: event.target.value });
                    }}
                    required 
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                </div>
                <Input 
                    id="confirm_password" 
                    type="password" 
                    onChange={(event) => {
                        const cp = event.target.value;
                        setConfirm_Password(cp);
                        setPasswordMatch(formData.password === cp);
                    }}
                    required 
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm font-medium">
                    {error}
                </div>
              )}
              <Button type="submit" className="w-full">
                Register
              </Button>
              <div className="text-center text-sm">
                Alreagy have an account?{" "}
                <Link to="/auth/login" className="underline underline-offset-4 text-blue-600">
                  Login
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
