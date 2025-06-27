import { AppSidebar } from "@/components/uix/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TopBar } from "./top-bar"

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        <div className="">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
