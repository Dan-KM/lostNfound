'use client';
import { AppSidebar } from "@/components/uix/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TopBar } from "./top-bar"

interface dashboardProps {
  title?: string;
  description?: string;
}

export default function Page({props, children }: {props?:dashboardProps, children: React.ReactNode;}) {
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        <div>
            {props && (
              <div>
              <h1 className="text-2xl font-semibold text-slate-800">{props.title}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {props.description}
              </p>  
            </div>
            )}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider> 
  )
}
