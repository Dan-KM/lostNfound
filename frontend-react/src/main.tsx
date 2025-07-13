import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import {  createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from '@/page/auth/login.tsx'
import AuthProvider from './hooks/useAuthProvider.tsx'
// import ProtectedRoutes from './hooks/protectedRoutes.tsx'
import Admin from '@/page/DashboardPage'
import EmailApp from '@/page/dashboard/test'
import RegisterPage from './page/auth/register.tsx'
import NotFound from './components/views/NotFound.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
  },
  {
    path: '/auth/login',
    element: <LoginPage/>
  },
  {
    path: '/auth/register',
    element: <RegisterPage/>
  },
  // {
  //   path: '/dashboard',
  //   element: <ProtectedRoutes allowedRoles={['admin']}><div>Dashboard</div></ProtectedRoutes>
  // },
  {
    path: '/dashboard',
    element: <Admin/>
  },
  {
    path: '/test',
    element: <EmailApp/>
  },
  {
    path: '*',
    element: <NotFound/>
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="light">
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </div>
  </StrictMode>,
)
