// 'use client';
// import { AppSidebar } from "@/components/uix/app-sidebar"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"
// import { TopBar } from "./top-bar"
// import { useAuthContext } from "@/hooks/useAuthContext";
// // import { useRouter } from "next/router";
// import { useRouter } from "next/navigation";


// interface dashboardProps {
//   title?: string;
//   description?: string;
// }

// export default function Page({props, children }: {props?:dashboardProps, children: React.ReactNode;}) {
//   const router = useRouter();
//   const [[isAuthenticated, setIsAuthenticated], [permission, setPermission]] = useAuthContext()
//   if(!isAuthenticated){
//     router.push('/Auth//login')
//   }
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <TopBar />
//         <div>
//             {props && (
//               <div>
//               <h1 className="text-2xl font-semibold text-slate-800">{props.title}</h1>
//               <p className="mt-2 text-sm text-slate-600">
//                 {props.description}
//               </p>  
//             </div>
//             )}
//           {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider> 
//   )
// }


'use client';
import { AppSidebar } from "@/components/uix/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TopBar } from "./top-bar"
import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation"; // ✅ Correct import
import { useEffect } from "react";

interface dashboardProps {
  title?: string;
  description?: string;
}

export default function Page({ props, children }: { props?: dashboardProps, children: React.ReactNode }) {
  const router = useRouter();
  const [[isAuthenticated, setIsAuthenticated], [permission, setPermission]] = useAuthContext()

  // ❗Don't run redirect during render – it causes hydration mismatch
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/Auth/login') // also: fix double slash
    }
  }, [isAuthenticated, router])

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
