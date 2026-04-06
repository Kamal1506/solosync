import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

export default function ProtectedRoute() {
  const { token } = useAuth()

  // No token? Redirect to login
  if (!token) return <Navigate to="/login" replace />

  // Token exists? Render the child route + Navbar
  return (
    <div className="flex w-full">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />   {/* renders the matched child route */}
      </main>
    </div>
  )
}
