import { useEffect, useState } from "react"

import { Dashboard } from "@/components/views/dashboard-home"
import Matches from "@/components/views/matches"
import Verification from "@/components/views/verification"
import ManagerTools from "@/components/views/manager-tools"

import { SubmitItem as SubmitLostItem } from "@/components/views/item-submission"
import Notifications from "@/components/views/Notifications"
import NotFound from "@/components/views/NotFound"
import DashboardLayout from "@/components/uix/dashboard-layout"

function page() {
  const [activeView, setActiveView] = useState("dashboard")

  // Handle hash changes
    useEffect(() => {
      const checkHash = () => {
        const hash = window.location.hash.substring(1);

        const [path, query] = hash.split('?');
  
        const segments = path.split('/');
        
        console.log('segment', segments);

        setActiveView(segments[0])
      };
  
      // Initial check
      checkHash();
      
      // Listen for hash changes
      window.addEventListener('hashchange', checkHash);
      
      return () => window.removeEventListener('hashchange', checkHash);
    }, []);

  const renderView = () => {
    switch (activeView) {
      case "home":
        return <Dashboard />
      case "matches":
        return <Matches />
      case "verification":
        return <Verification />
      case "manager":
        return <ManagerTools />
      case "submit-lost":
        return <SubmitLostItem />
      case "submit-found":
        return <SubmitLostItem />
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