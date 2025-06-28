'use client';

import DashboardLayout from "@/components/uix/dashboardLayout";
import { VerificationQuestions } from "@/components/views/VerificationQuestions";

export default function Page () {

    return (
      <DashboardLayout>
        <div className="p-6">
            <VerificationQuestions userRole='manager'/>
        </div>
      </DashboardLayout>
    )
}
