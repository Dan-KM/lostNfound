import DashboardLayout from "@/components/uix/dashboardLayout";

import React from 'react'

export default function Page () {
  return (
    <DashboardLayout>
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">
            Welcome to your dashboard! Here you can manage your account, view notifications, and access various tools.
            </p>
        </div>
    </DashboardLayout>
  )
}
