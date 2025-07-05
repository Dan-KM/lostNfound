import { useState } from 'react'
import { Badge } from "@/components/ui/badge";
import {
  Bell, 
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

// import { NavUser } from './nav-user'; 
import { useAuth } from '@/hooks/useAuthProvider';


export const TopBar = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { currentUser } = useAuth()
  return (
    <>
        <header className="bg-white border-b border-slate-200 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
          <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
                />
            </div>
          </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
          variant="ghost" 
          size="sm" 
          className="relative"
          onClick={() => setActiveSection("notifications")}
              >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
            3
          </Badge>
              </Button>
              {/* <NavUser user={{
                  name: currentUser?.first_name ?? "",
                  email: currentUser?.email?? "",
                  avatar: ''
                }} /> */}
            </div>
          </div>
        </header>
    </>
  )
}