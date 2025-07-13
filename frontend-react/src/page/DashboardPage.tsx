import { useEffect, useState } from "react"

import { Dashboard } from "@/components/views/dashboard-home"
import Matches from "@/components/views/matches"
import Verification from "@/components/views/verification"
import ManagerTools from "@/components/views/manager-tools"

import { SubmitItem as SubmitLostItem } from "@/components/views/item-submission"
import Notifications from "@/components/views/Notifications"
import NotFound from "@/components/views/NotFound"
import DashboardLayout from "@/components/uix/dashboard-layout"
import ProtectedRoutes from "@/hooks/protectedRoutes"

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
        return <ProtectedRoutes allowedRoles={['__all__']}><Dashboard /></ProtectedRoutes>
      case "matches":
        return <ProtectedRoutes allowedRoles={['manager']}><Matches /></ProtectedRoutes>
      case "verification":
      return <ProtectedRoutes allowedRoles={['claimant']}><Verification /></ProtectedRoutes>
      case "manager":
        return <ProtectedRoutes allowedRoles={['manager']}><ManagerTools /></ProtectedRoutes>
      case "submit-lost":
        return <ProtectedRoutes allowedRoles={['claimant', 'finder']}><SubmitLostItem /></ProtectedRoutes>
      case "submit-found":
        return <ProtectedRoutes allowedRoles={['claimant', 'finder']}><SubmitLostItem /></ProtectedRoutes>
      case "notifications":
        return <ProtectedRoutes allowedRoles={['__all__']}><Notifications /></ProtectedRoutes>
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