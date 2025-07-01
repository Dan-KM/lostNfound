
// 'use client';

// import React, { useContext, useState, createContext } from 'react'

// type AuthContextType = [
//   [boolean, React.Dispatch<React.SetStateAction<boolean>>],
//   [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>]
// ]

// // Set a default value to avoid TS error
// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
//     !!localStorage.getItem('isAuthenticated')
//   )
// const [permission, setPermission] = useState<string>()

//   return (
//     <AuthContext.Provider value={[[isAuthenticated, setIsAuthenticated], [permission, setPermission]]}>
//         {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuthContext = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useNavigationContext must be used within a AuthProvider')
//   }
//   return context
// }


'use client';

import React, { useContext, useState, useEffect, createContext } from 'react'

type AuthContextType = [
  [boolean, React.Dispatch<React.SetStateAction<boolean>>],
  [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>]
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [permission, setPermission] = useState<string>()

  // Safe browser-only access to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('accessToken')
    setIsAuthenticated(!!stored)
  }, [])

  return (
    <AuthContext.Provider value={[[isAuthenticated, setIsAuthenticated], [permission, setPermission]]}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
