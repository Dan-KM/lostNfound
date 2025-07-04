"use client"

import { type LucideIcon } from "lucide-react"
import React from "react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

type MainNavProps = {
  items : {
    title: string,
    url: string,
    icon: LucideIcon,
    isActive : boolean
  }[]
}

const NavMain = ({items}: MainNavProps) => {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className={
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-500 hover:text-white" 
                    : ""
                }
                asChild
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain