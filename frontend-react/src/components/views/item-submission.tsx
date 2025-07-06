'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ChevronDownIcon, MapPin, Package, CircleGauge } from "lucide-react";
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
  
  const {currentUser} = useAuth()
    
  const [currentUserRole, setCurrentUserRole] = useState<string | null>()

  const [apiResponse, setApiResponse] = useState<AxiosResponse | null>()
  
    useEffect(() => {
      if(currentUser)
        setCurrentUserRole(currentUser.user_role)
    }, [currentUser])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.reported_date && formData.category && formData.subcategory && formData.name && formData.description && formData.location) {

      formData.item_type = (currentUserRole == 'claimant'? 'lost' : 'found')
      console.log('formdata ==> ', formData);
      try {
        const response = await API.post(
          'inventory/items/',
          JSON.stringify(formData)
        )
        setApiResponse(response)

      } catch (error) {
        console.error(error)
      }
    }
    else{
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

  return (
    <ProtectedRoutes allowedRoles={['admin','claimant', 'finder']}>
      {apiResponse && (
        <>
          <PopupWindow handleCloseWindow={() => {
            setApiResponse(null)
          }}>
            <h2>
              {apiResponse.data.serial_id}
            </h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g., iPhone 13 Pro"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error}
                </p>
              )}

              {currentUserRole == 'claimant'? (
              <>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => {
                  toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                      label: "Undo",
                      onClick: () => console.log("Undo"),
                    },
                  });
                }}
              >
                Submit Lost Item Report
              </Button>
              </>
            ): (
            <>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Submit Found Item Report
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
