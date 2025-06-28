'use client';

import DashboardLayout from "@/components/uix/dashboardLayout";
import { ManagerTools } from "@/components/views/ManagerTools";

export default function Page () {

    return (
      <DashboardLayout>
        <div className="p-6">
            <ManagerTools/>
        </div>
      </DashboardLayout>
    )
}