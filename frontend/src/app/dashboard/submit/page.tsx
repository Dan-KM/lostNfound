'use client';

import DashboardLayout from "@/components/uix/dashboardLayout";
import { SubmitLostItem } from "@/components/views/SubmitLostItem";

export default function Page () {

    return (
      <DashboardLayout>
        <div className="p-6">
            <SubmitLostItem/>
        </div>
      </DashboardLayout>
    )
}
