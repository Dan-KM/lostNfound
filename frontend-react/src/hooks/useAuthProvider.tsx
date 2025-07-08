'use client';

import { API } from "@/lib/API";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

interface User {
    first_name : string,
    last_name : string,
    email : string,
    user_role : string,
}

type LoginFormData = {
    email: string;
    password: string;
}

type contextProps = {
    currentUser? : User | null;
    authToken?: string | null;
    refreshToken? : string | null;
    handleLogin : (formData : LoginFormData) => Promise<void>;
    handleLogout : () => Promise<void>;
    getUser : () => Promise<User | null | undefined>;
}

type AuthProviderProps = PropsWithChildren;

const AuthContext = createContext<contextProps | undefined>(undefined)

export default function AuthProvider ({ children }: AuthProviderProps ) {
    const [authToken, setAuthToken] = useState<string | null>()
    const [refreshToken, setRefreshToken] = useState<string | null>()
    const [currentUser, setCurrentUser] = useState<User | null>()

    async function handleLogin (value : LoginFormData) {
        try{
            const response = await API.post('auth/token/', value)
            const token =  response.data.access
            const refresh = response.data.refresh
            setAuthToken(token)
            setRefreshToken(refresh)
            localStorage.setItem('access_token', token)
            localStorage.setItem('refresh_token', refresh)

            await getUser()
        }catch(error){
            setAuthToken(null)
            setRefreshToken(null)
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        }
    }


    async function getUser (){
        try{
            const response = await API.get('auth/me/')
            setCurrentUser(response.data)

        }catch(error){
            setCurrentUser(null)
        }
        return currentUser
    }

    async function handleLogout (){
        setCurrentUser(null)
        setAuthToken(null)
        setRefreshToken(null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }



    useEffect(()=>{
        async function fetchUser (){
            try{
                await getUser()
                // setCurrentUser({
                //     last_name: 'daniel',
                //     first_name: 'daniel',
                //     user_role: 'admin',
                //     email:'my email'
                // })
            }catch{
                setCurrentUser(null)
            }
        }

        fetchUser()
    },[])


    return (
        <AuthContext.Provider 
            value={{
                currentUser,
                authToken,
                refreshToken,
                handleLogin,
                handleLogout,
                getUser
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth (){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used inside of a AuthProvider')
    }
    return context;
}