'use client';

import DashboardLayout from "@/components/uix/dashboardLayout";
import { NotificationPage } from "@/components/views/NotificationPage";

export default function Page () {

    return (
      <DashboardLayout>
        <div className="p-6">
            <NotificationPage userRole='manager'/>
        </div>
      </DashboardLayout>
    )
}
