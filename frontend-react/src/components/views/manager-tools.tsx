'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
} from "lucide-react";

import { ItemReception } from "./itemReceprion";
import ItemHandover from "./itemHandover";

const ManagerTools = () => {
  
  // const { toast } = useToast();

  return (
    <div className="space-y-6 m-4">
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

        {/* item reception */}
        <TabsContent value="reception" className="space-y-6">
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center">
                <Package className="mr-3 h-5 w-5 text-blue-600" />
                Log Item Reception
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ItemReception/>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Handover Management*/}
        <TabsContent value="handover" className="space-y-6">
          <div className="space-y-4">
          </div>
        </TabsContent>
        
        {/* Items In Custody*/}
        <TabsContent value="custody" className="space-y-6">
          <ItemHandover/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerTools;