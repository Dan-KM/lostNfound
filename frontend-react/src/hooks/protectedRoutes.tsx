import { useEffect, type PropsWithChildren } from "react"
import { useAuth } from "./useAuthProvider"
import PermissionDenied from "@/components/uix/permission-denied"

type ProtectedRoutesProps = PropsWithChildren & {
    allowedRoles?: string [],
}

export default function ProtectedRoutes ({children, allowedRoles} : ProtectedRoutesProps ){
    const { currentUser, getUser } = useAuth()

    useEffect(()=>{
        async function s(){
            await getUser()
        }
        s()
    },[])

    if (!allowedRoles?.includes("__all__")) {
        if(currentUser === undefined){
            return <><div>Loading...</div></>
        }
        
        if(currentUser === null){
            return <PermissionDenied/>
        }

        if (currentUser && allowedRoles && !allowedRoles.includes(currentUser.user_role)){
            return <PermissionDenied/>
        }
    }

    return children
}