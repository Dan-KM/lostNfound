
'use client';

import React, { useContext, useState, createContext } from 'react'

type NavContextType = [string, React.Dispatch<React.SetStateAction<string>>]

// Set a default value to avoid TS error
const NavContext = createContext<NavContextType | undefined>(undefined)

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState('dashboard')

  return (
    <NavContext.Provider value={[currentView, setCurrentView]}>
      {children}
    </NavContext.Provider>
  )
}

export const useNavigationContext = () => {
  const context = useContext(NavContext)
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider')
  }
  return context
}
