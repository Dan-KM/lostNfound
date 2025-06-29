'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";


export const SubmitLostItem = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    lastSeenLocation: "",
    dateLost: "",
    photo: null as File | null
  });
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Lost Item Report Submitted",{
      description: "Your report has been submitted successfully. We'll notify you of any matches.",
    });
    setFormData({
      itemName: "",
      description: "",
      category: "",
      lastSeenLocation: "",
      dateLost: "",
      photo: null
    });
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
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800 flex items-center">
            <MapPin className="mr-3 h-6 w-6 text-orange-600" />
            Report Lost Item
          </CardTitle>
          <p className="text-slate-600">
            Provide detailed information about your lost item to help us find a match.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  placeholder="e.g., iPhone 13 Pro"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="keys">Keys</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="bags">Bags & Luggage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item in detail (color, brand, distinctive features, etc.)"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lastSeenLocation">Last Seen Location</Label>
                <Input
                  id="lastSeenLocation"
                  placeholder="e.g., Main Library, 2nd floor"
                  value={formData.lastSeenLocation}
                  onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateLost">Date Lost</Label>
                <Input
                  id="dateLost"
                  type="date"
                  value={formData.dateLost}
                  onChange={(e) => setFormData({ ...formData, dateLost: e.target.value })}
                  required
                />
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
      <Button
                variant="outline"
                onClick={() =>
                  toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                      label: "Undo",
                      onClick: () => console.log("Undo"),
                    },
                  })
                }
              >
                Show Toast
              </Button>
      </Card>
    </div>
  );
};
