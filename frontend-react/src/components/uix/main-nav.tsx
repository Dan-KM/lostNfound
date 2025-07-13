import {
  HomeIcon,
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  BellDot,
  Package
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuthProvider"
// import { useLocation, Link } from "react-router-dom"


const data = {
  navMain: [
    {
      id: "home",
      title: "Home",
      icon: HomeIcon,
      allowedRoles: ["__all__"],
    },
    {
      id: "matches",
      title: "Matches",
      icon: Bot,
      allowedRoles: ["admin", "manager"],
    },
    {
      id: "verification",
      title: "Verification",
      icon: BookOpen,
      allowedRoles: ["admin", "claimant",]
    },
    {
      id: "manager",
      title: "Manager tools",
      icon: Settings2,
      allowedRoles: ["admin", "manager"],
    },
    {
      id: "submit-lost",
      title: "Report Lost Items",
      icon: GalleryVerticalEnd,
      allowedRoles: ["admin", "claimant"],
    },
    {
      id: "submit-found",
      title: "Report Items",
      icon: GalleryVerticalEnd,
      allowedRoles: ["admin","finder"],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: BellDot,
      allowedRoles: ["__all__"],
    },
  ],
}

export function AppSidebar(){
  const { open } = useSidebar()
  const { currentUser } = useAuth()

  const filteredNavItems = data.navMain.filter((item) => {
    const userRole = currentUser?.user_role
    return (
      item.allowedRoles.includes("__all__") ||
      (userRole && item.allowedRoles.includes(userRole))
    )
  })

  function handleNavButtonClick (value : string){
    window.location.hash = value;
  }


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-4">
          <Package className="h-8 w-8 text-blue-600" />
          {open && (
            <>
              <span
                className="text-2xl font-semibold text-slate-800 transition-opacity duration-500 delay-200 opacity-0"
                style={{ animation: open ? "fadeIn 0.5s 0.2s forwards" : undefined }}
              >
                Lost &amp; Found
              </span>
              <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    handleNavButtonClick(item.id)
                  }}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
