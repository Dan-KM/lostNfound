'use client';

import DashboardLayout from "@/components/uix/dashboardLayout";
import { SubmitLostItem } from "@/components/views/SubmitLostItem";
import { MapPin } from "lucide-react";

export default function Page () {

    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <MapPin className="mr-3 h-6 w-6 text-orange-600" />
              <p className="text-2xl text-slate-800 flex items-center">Report Lost Item</p>
            </div>
            <p className="text-slate-600">
              Provide detailed information about your lost item to help us find a match.
            </p>
          </div>
            <SubmitLostItem/>
        </div>
      </DashboardLayout>
    )
}
