'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, MapPin, ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { CategorySelect } from '@/components/uix/categorySelect'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { sub } from "date-fns";

export const SubmitLostItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    category: 0,
    subcategory: 0,
    reported_date: "",
    photo: null as File | null
  });
  const [open, setOpen] = useState(false)
  const [reported_date, setReported_date] = useState<Date | undefined>(undefined)
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // toast("Lost Item Report Submitted",{
    //   description: "Your report has been submitted successfully. We'll notify you of any matches.",
    // });
    
    if (formData.reported_date && formData.category && formData.subcategory && formData.name && formData.description && formData.location) {
      console.log('formdata ==> ', formData);
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
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-sm border border-slate-200">
        {/* <CardHeader>
          <CardTitle className="text-2xl text-slate-800 flex items-center">
            <MapPin className="mr-3 h-6 w-6 text-orange-600" />
            Report Lost Item
          </CardTitle>
          <p className="text-slate-600">
            Provide detailed information about your lost item to help us find a match.
          </p>
        </CardHeader> */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="reported_date">Last Seen Location <span className="text-red-500">*</span></Label>
                <Input
                  id="reported_date"
                  placeholder="e.g., Main Library, 2nd floor"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="date" className="px-1">
                    Date Lost 
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
