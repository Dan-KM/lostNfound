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
      allowedRoles: ["admin", "manager", "claimant",]
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



// const data = {
//   navMain: [
//     {
//       id: 1,
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: HomeIcon,
//       allowedRoles: ["admin", "manager"],
//     },
//     {
//       id: 2,
//       title: "Matches",
//       url: "/dashboard/matches",
//       icon: Bot,
//       allowedRoles: ["admin", "manager"],
//     },
//     {
//       id: 3,
//       title: "Verification",
//       url: "/dashboard/verification",
//       icon: BookOpen,
//       allowedRoles: ["admin", "manager"],
//     },
//     {
//       id: 4,
//       title: "Manager tools",
//       url: "/dashboard/manager",
//       icon: Settings2,
//       allowedRoles: ["admin", "manager"],
//     },
//     {
//       id: 5,
//       title: "Report Lost Items",
//       url: "/dashboard/submit",
//       icon: GalleryVerticalEnd,
//       allowedRoles: ["claimant"],
//     },
//     {
//       id: 6,
//       title: "Report Items",
//       url: "/dashboard/submit",
//       icon: GalleryVerticalEnd,
//       allowedRoles: ["finder"],
//     },
//     {
//       id: 7,
//       title: "Notifications",
//       url: "/dashboard/notifications",
//       icon: BellDot,
//       allowedRoles: ["__all__"],
//     },
//   ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { open } = useSidebar()
  // const { currentUser } = useAuth()
//   const location = useLocation()

//   const filteredNavItems = data.navMain.filter((item) => {
//   const userRole = currentUser?.user_role
//     return (
//       item.allowedRoles.includes("__all__") ||
//       (userRole && item.allowedRoles.includes(userRole))
//     )
//   })


//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <div className="flex items-center space-x-4">
//           <Package className="h-8 w-8 text-blue-600" />
//           {open && (
//             <>
//               <span
//                 className="text-2xl font-semibold text-slate-800 transition-opacity duration-500 delay-200 opacity-0"
//                 style={{ animation: open ? "fadeIn 0.5s 0.2s forwards" : undefined }}
//               >
//                 Lost &amp; Found
//               </span>
//               <style>
//                 {`
//                   @keyframes fadeIn {
//                     to { opacity: 1; }
//                   }
//                 `}
//               </style>
//             </>
//           )}
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarMenu>
//             {filteredNavItems.map((item) => {
//               const isActive = location.pathname === item.url
//               return (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton
//                     tooltip={item.title}
//                     className={
//                       isActive
//                         ? "bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
//                         : ""
//                     }
//                     asChild
//                   >
//                     <Link to={item.url}>
//                       {item.icon && <item.icon />}
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               )
//             })}
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter />
//       <SidebarRail />
//     </Sidebar> 
//   )
// }


// export function AppSidebar({
//   onItemSelect,
//   ...props
// }: React.ComponentProps<typeof Sidebar> & {
//   onItemSelect?: (id: string) => void
// }) {
//   const { open } = useSidebar()
//   const { currentUser } = useAuth()

//   const filteredNavItems = data.navMain.filter((item) => {
//     const userRole = currentUser?.user_role
//     return (
//       item.allowedRoles.includes("__all__") ||
//       (userRole && item.allowedRoles.includes(userRole))
//     )
//   })


//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <div className="flex items-center space-x-4">
//           <Package className="h-8 w-8 text-blue-600" />
//           {open && (
//             <>
//               <span
//                 className="text-2xl font-semibold text-slate-800 transition-opacity duration-500 delay-200 opacity-0"
//                 style={{ animation: open ? "fadeIn 0.5s 0.2s forwards" : undefined }}
//               >
//                 Lost &amp; Found
//               </span>
//               <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
//             </>
//           )}
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarMenu>
//             {filteredNavItems.map((item) => (
//               <SidebarMenuItem key={item.title}>
//                 <SidebarMenuButton
//                   tooltip={item.title}
//                   onClick={() => onItemSelect?.(item.id)}
//                 >
//                   {item.icon && <item.icon />}
//                   <span>{item.title}</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             ))}
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter />
//       <SidebarRail />
//     </Sidebar>
//   )
// }



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
