import { useEffect, type PropsWithChildren } from "react"
import { useAuth } from "./useAuthProvider"
import PermissionDenied from "@/components/uix/permission-denied"
import { useNavigate } from "react-router-dom"

type ProtectedRoutesProps = PropsWithChildren & {
    allowedRoles?: string [],
}

export default function ProtectedRoutes ({children, allowedRoles} : ProtectedRoutesProps ){
    const { currentUser, getUser } = useAuth()
    const navigate = useNavigate()
    useEffect(()=>{
        async function s(){
            try {
                await getUser()
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate('/auth/login');
                } else {
                    console.error('Error fetching user:', error);
                }
                navigate('/auth/login');
            }
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