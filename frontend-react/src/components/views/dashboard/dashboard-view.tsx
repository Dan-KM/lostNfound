import { useEffect, useState } from "react"

import DashboardHome from "@/components/views/dashboard-home"
import Matches from "@/components/views/matches"
import Verification from "@/components/views/verification"
import ManagerTools from "@/components/views/manager-tools"
import ReportLost from "@/components/views/item-submission"
import ReportFound from "@/components/views/item-submission"
import Notifications from "@/components/views/Notifications"
import NotFound from "@/components/views/NotFound"
import DashboardLayout from "@/components/uix/dashboard-layout"

function page() {
  const [activeView, setActiveView] = useState("dashboard")

  // Handle hash changes
    useEffect(() => {
      const checkHash = () => {
        const hash = window.location.hash;
        // setShowCompose(hash.includes('compose'));
        setActiveView(hash.substring(1))
        // console.log(hash.substring(1));

      };
  
      // Initial check
      checkHash();
      
      // Listen for hash changes
      window.addEventListener('hashchange', checkHash);
      
      return () => window.removeEventListener('hashchange', checkHash);
    }, []);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardHome />
      case "matches":
        return <Matches />
      case "verification":
        return <Verification />
      case "manager":
        return <ManagerTools />
      case "submit-lost":
        return <ReportLost />
      case "submit-found":
        return <ReportFound />
      case "notifications":
        return <Notifications />
      default:
        return <NotFound />
    }
  }

  return (
    
    <DashboardLayout props={{
      setActiveView
    }}>
      {renderView()}
    </DashboardLayout>
    
  )
}


export default page