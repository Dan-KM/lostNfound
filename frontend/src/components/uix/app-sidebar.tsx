"use client"

import * as React from "react"
import {
  HomeIcon,
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  BellDot,
  Package
} from "lucide-react"

import NavMain from "@/components/uix/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
        title: "Dashboard",
        url: "/dashboard",
        icon: HomeIcon,
        isActive: false,
        },
        {
        title: "Matches",
        url: "#",
        icon: Bot,
        },
        {
        title: "Verification",
        url: "#",
        icon: BookOpen,
        },
        {
        title: "Manager tools",
        url: "#",
        icon: Settings2,
        },
        {
        title: "Report Lost Items",
        url: "#",
        icon: GalleryVerticalEnd,
        },
        {
        title: "Report Found Items",
        url: "#",
        icon: GalleryVerticalEnd,
        },
        {
        title: "Notifications",
        url: "#",
        icon: BellDot,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-blue-600" />
              {open && (
                <span className="text-2xl font-semibold text-slate-800">Lost & Found</span>
              )}
          </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
