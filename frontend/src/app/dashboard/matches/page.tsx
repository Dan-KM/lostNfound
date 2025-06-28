'use client';

import DashboardLayout from "@/components/uix/dashboardLayout";
import { MatchNotifications } from "@/components/views/MatchNotifications";



export default function Page () {

  return (
    
      <DashboardLayout>
        <div className="p-6">
            <MatchNotifications userRole="manager"/>
        </div>
      </DashboardLayout>
  )
}
