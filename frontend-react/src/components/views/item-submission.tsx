
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ChevronDownIcon, MapPin, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CategorySelect } from '@/components/uix/categorySelect'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useAuth } from "@/hooks/useAuthProvider";
import ProtectedRoutes from "@/hooks/protectedRoutes";
import { API } from "@/lib/API";
import { PopupWindow } from "../uix/popup-window";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const SubmitItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    item_type: "",
    location: "",
    category: 0,
    subcategory: 0,
    reported_date: "",
    photo: null as File | null
  });
  const [open, setOpen] = useState(false)
  const [reported_date, setReported_date] = useState<Date | undefined>(undefined)
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {currentUser} = useAuth()
  const router = useNavigate();
    
  const [currentUserRole, setCurrentUserRole] = useState<string | null>()

  const [apiResponse, setApiResponse] = useState<AxiosResponse | null>()
  
    useEffect(() => {
      if(currentUser)
        setCurrentUserRole(currentUser.user_role)
    }, [currentUser])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    if (formData.reported_date && formData.category && formData.subcategory && formData.name && formData.description && formData.location) {
      setIsSubmitting(true);
      
      formData.item_type = (currentUserRole == 'claimant'? 'lost' : 'found')
      console.log('formdata ==> ', formData);
      
      try {
        const response = await API.post(
          'inventory/items/',
          JSON.stringify(formData)
        )
        setApiResponse(response)
        
        // Show success toast
        toast.success(
          `${currentUserRole === 'claimant' ? 'Lost' : 'Found'} item reported successfully!`,
          {
            description: `Item ID: ${response.data.serial_id}`,
            action: {
              label: "View Dashboard",
              onClick: () => router('/dashboard#home'),
            },
          }
        );
        
        // Redirect to dashboard after a short delay
        // setTimeout(() => {
        //   router('/dashboard#home');
        // }, 2000);

      } catch (error: any) {
        console.error('Submission error:', error);
        
        // Handle different error types
        if (error.response?.status === 400) {
          if (error.response?.data?.detail?.includes('duplicate') || 
              error.response?.data?.message?.includes('already exists') ||
              error.response?.data?.error?.includes('duplicate')) {
            setError("This item has already been reported. Please check if you've already submitted this item or try with different details.");
            toast.error("Duplicate submission detected", {
              description: "This item appears to have already been reported.",
            });
          } else {
            setError("Invalid submission. Please check your input and try again.");
            toast.error("Submission failed", {
              description: "Please verify all fields are correctly filled.",
            });
          }
        } else if (error.response?.status === 401) {
          setError("Authentication required. Please log in again.");
          toast.error("Authentication error", {
            description: "Please log in and try again.",
          });
        } else if (error.response?.status === 403) {
          setError("You don't have permission to perform this action.");
          toast.error("Permission denied", {
            description: "Contact an administrator if you believe this is an error.",
          });
        } else if (error.response?.status >= 500) {
          setError("Server error. Please try again later.");
          toast.error("Server error", {
            description: "Our servers are experiencing issues. Please try again later.",
          });
        } else {
          setError("An unexpected error occurred. Please try again.");
          toast.error("Submission failed", {
            description: "An unexpected error occurred. Please try again.",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill all required fields and select a date.");
      setError("Please fill all required fields");
      return;
    }

    console.log('formdata ==> ', formData);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const handleClosePopup = () => {
    setApiResponse(null);
  };

  return (
    <ProtectedRoutes allowedRoles={['admin','claimant', 'finder']}>
      {apiResponse && (
        <>
          <PopupWindow handleCloseWindow={handleClosePopup}>
            <div className="text-center p-6">
              <div className="text-green-600 mb-4">
                <Package className="mx-auto h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Item Reported Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                Your item has been registered with ID:
              </p>
              <p className="text-xl font-mono bg-gray-100 p-3 rounded-lg mb-4">
                {apiResponse.data.serial_id}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                You will be redirected to the dashboard shortly.
              </p>
              <Button 
                onClick={handleClosePopup}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </PopupWindow>
        </>
      )}
      <div className="max-w-2xl mx-auto min-h-[90svh] grid items-center">
        <Card className="bg-white shadow-sm border border-slate-200 m-4">
          <CardHeader>
            {currentUserRole ==='claimant'? (
              <>
                <CardTitle className="text-2xl text-slate-800 flex items-center">
                  <MapPin className="mr-3 h-6 w-6 text-orange-600" />
                  Report Lost Item
                </CardTitle>
                <p className="text-slate-600">
                  Provide detailed information about your lost item to help us find a match.
                </p>
              </>
              ):(
                <>
                  <CardTitle className="text-2xl text-slate-800 flex items-center">
                    <Package className="mr-3 h-6 w-6 text-green-600" />
                    Report Found Item
                  </CardTitle>
                  <p className="text-slate-600">
                    Help reunite items with their owners by reporting what you've found.
                  </p>
                </>
              )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                  </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g., iPhone 13 Pro"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <CategorySelect setCategory={value=>{
                    const [categoryId, subcategoryId] = value.split(':');
                    setFormData({
                      ...formData,
                      category: parseInt(categoryId),
                      subcategory: parseInt(subcategoryId)
                    });
                  }}/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail (color, brand, distinctive features, etc.)"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reported_date">
                    {currentUserRole == 'claimant'? (<>Last Seen Location</>): (<>Location Found</>)} 
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reported_date"
                    placeholder="e.g., Main Library, 2nd floor"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="date" className="px-1">
                      {currentUserRole == 'claimant'? (<>Date Lost</>): (<>Date Found</>)} 
                      <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-48 justify-between font-normal"
                          disabled={isSubmitting}
                        >
                          {reported_date ? reported_date.toLocaleDateString() : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={reported_date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (!!date){
                              setReported_date(date)
                              setOpen(false)
                              setFormData({ ...formData, reported_date: date.toISOString() });
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                </div>

              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Upload Photo (Optional)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="mt-4">
                    <Label htmlFor="photo" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Click to upload
                      </span>
                      <span className="text-slate-500"> or drag and drop</span>
                    </Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                  {formData.photo && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.photo.name} uploaded
                    </p>
                  )}
                </div>
              </div>
              {currentUserRole == 'claimant'? (
              <>
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Lost Item Report'}
                </Button>
              </>
            ): (
            <>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Found Item Report'}
              </Button>
            </>
          )} 
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoutes>
  );
};