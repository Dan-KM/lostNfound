"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuthProvider";
import { useNavigate } from 'react-router-dom';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '', 
        password: ''
    });
    
    const { handleLogin, currentUser, authToken } = useAuth();
    
    const [loginComplete, setLoginComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });

    // Clear errors when user starts typing
    const handleInputChange = (field: 'email' | 'password', value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear field-specific error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        
        // Clear general error when user makes changes
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {
            email: '',
            password: '',
            general: ''
        };

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors(prev => ({ ...prev, general: '' }));

        try {
            await handleLogin(formData);
            
            // If handleLogin doesn't throw, login was successful
            setLoginComplete(true);
            navigate('/dashboard#home', { replace: true });
        } catch (error: any) {
            console.error('Login error:', error);
            
            // Handle different types of errors
            let errorMessage = 'An unexpected error occurred. Please try again.';
            
            if (error?.response?.status === 401) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error?.response?.status === 429) {
                errorMessage = 'Too many login attempts. Please try again later.';
            } else if (error?.response?.status === 404) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error?.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            setErrors(prev => ({ ...prev, general: errorMessage }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (loginComplete) {
            console.log('currentUser after login ->', currentUser);
            console.log('authToken after login ->', authToken);
        }
    }, [loginComplete, currentUser, authToken]);

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

                            {/* General Error Message */}
                            {errors.general && (
                                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span>{errors.general}</span>
                                </div>
                            )}

                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
                                    disabled={isLoading}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={cn(
                                            "pr-10",
                                            errors.password && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Login"}
                            </Button>

                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <a href="auth/register" className="underline underline-offset-4 text-blue-600">
                                    Sign up
                                </a>
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
    );
}