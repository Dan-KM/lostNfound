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

import { useNavigationContext } from "@/hooks/useNavigationContenxt";

const data = {
    navMain: [
        {
        title: "Dashboard",
        url: "/dashboard",
        icon: HomeIcon,
        isActive: true,
        },
        {
        title: "Matches",
        url: "/dashboard/matches",
        icon: Bot,
        isActive: false,
        },
        {
        title: "Verification",
        url: "/dashboard/verification",
        icon: BookOpen,
        isActive: false,
        },
        {
        title: "Manager tools",
        url: "/dashboard/manager",
        icon: Settings2,
        isActive: false,
        },
        {
        title: "Report Lost Items",
        url: "/dashboard/submit",
        icon: GalleryVerticalEnd,
        isActive: false,
        },
        {
        title: "Report Found Items",
        url: "/dashboard/submit",
        icon: GalleryVerticalEnd,
        isActive: false,
        },
        {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: BellDot,
        isActive: false,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
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
                  <style>
                  {`
                  @keyframes fadeIn {
                    to { opacity: 1; }
                  }
                  `}
                  </style>
                </>
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
