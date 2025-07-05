import type { PropsWithChildren } from "react"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { AppSidebar } from "./main-nav"
import { TopBar } from "./top-bar"

type DashboardLayoutProps = PropsWithChildren & {
    props : {
        title? : string,
        description? : string
        setActiveView : (id: string) => void
    }
}
function DashboardLayout({children, props}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <TopBar />
        <div>
          {props && (
            <div >
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

export default DashboardLayout