'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Shield, 
  QrCode, 
  HandHeart, 
  Clock,
  CheckCircle,
  User,
  MapPin
} from "lucide-react";

import { toast } from "sonner"

const ManagerTools = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    location: "",
    finderName: ""
  });
  
  // const { toast } = useToast();

  const pendingHandovers = [
    {
      id: 1,
      itemName: "iPhone 13 Pro",
      claimant: "John Smith",
      finder: "Sarah Johnson",
      serialNumber: "LF-2024-001",
      status: "verified",
      appointmentTime: "2024-01-16 14:00"
    },
    {
      id: 2,
      itemName: "Blue Wallet",
      claimant: "Emily Davis",
      finder: "Mike Wilson",
      serialNumber: "LF-2024-003",
      status: "scheduled",
      appointmentTime: "2024-01-16 16:30"
    }
  ];

  const itemsInCustody = [
    {
      id: 1,
      name: "MacBook Pro",
      serialNumber: "LF-2024-002",
      dateReceived: "2024-01-14",
      location: "Student Center",
      finder: "Alex Chen",
      status: "unclaimed"
    },
    {
      id: 2,
      name: "Car Keys",
      serialNumber: "LF-2024-004",
      dateReceived: "2024-01-15",
      location: "Library",
      finder: "Lisa Park",
      status: "pending_match"
    }
  ];

  const generateSerialNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `LF-${year}-${randomNum}`;
  };

  const handleLogReception = () => {
    if (newItem.name && newItem.description) {
      const generatedSerial = generateSerialNumber();
      setSerialNumber(generatedSerial);
      toast("Item Logged Successfully",{
        description: `Serial number ${generatedSerial} assigned to ${newItem.name}`,
      });
      setNewItem({ name: "", description: "", location: "", finderName: "" });
    }
  };

  const handleCompleteHandover = (handoverId: number) => {
    toast("Handover Completed",{
      description: "Item has been successfully handed over to the claimant.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Manager Tools</h2>
        <p className="text-slate-600">
          Manage item reception, serial numbers, and handover processes.
        </p>
      </div>

      <Tabs defaultValue="reception" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reception">Item Reception</TabsTrigger>
          <TabsTrigger value="handover">Handover Management</TabsTrigger>
          <TabsTrigger value="custody">Items in Custody</TabsTrigger>
        </TabsList>

        <TabsContent value="reception" className="space-y-6">
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center">
                <Package className="mr-3 h-5 w-5 text-blue-600" />
                Log Item Reception
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    placeholder="e.g., iPhone 13 Pro"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finderName">Finder Name</Label>
                  <Input
                    id="finderName"
                    placeholder="Name of person who found the item"
                    value={newItem.finderName}
                    onChange={(e) => setNewItem({ ...newItem, finderName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemDescription">Description</Label>
                <Input
                  id="itemDescription"
                  placeholder="Detailed description of the item"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundLocation">Location Found</Label>
                <Input
                  id="foundLocation"
                  placeholder="Where was the item found?"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                />
              </div>

              {serialNumber && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Generated Serial Number: {serialNumber}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleLogReception}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Log Item Reception
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handover" className="space-y-6">
          <div className="space-y-4">
            {pendingHandovers.map((handover) => (
              <Card key={handover.id} className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-slate-800">{handover.itemName}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {handover.serialNumber}
                        </Badge>
                        <Badge 
                          className={handover.status === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {handover.status === "verified" ? "Verified" : "Scheduled"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-slate-600">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Claimant: {handover.claimant}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Finder: {handover.finder}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {handover.appointmentTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleCompleteHandover(handover.id)}
                      >
                        <HandHeart className="h-4 w-4 mr-2" />
                        Complete Handover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custody" className="space-y-6">
          <div className="space-y-4">
            {itemsInCustody.map((item) => (
              <Card key={item.id} className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                        <Badge className="bg-purple-100 text-purple-800">
                          {item.serialNumber}
                        </Badge>
                        <Badge 
                          className={item.status === "unclaimed" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}
                        >
                          {item.status === "unclaimed" ? "Unclaimed" : "Pending Match"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-slate-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Found: {item.location}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Finder: {item.finder}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Received: {item.dateReceived}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerTools;