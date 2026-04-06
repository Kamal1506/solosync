import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login       from './pages/Login'
import Dashboard   from './pages/Dashboard'
import Clients     from './pages/Clients'
import Projects    from './pages/Projects'
import Tasks       from './pages/Tasks'
import Payments    from './pages/Payments'

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Routes>
        {/* PUBLIC route — no auth needed */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED routes — redirect to /login if no token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/"          element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />}  />
          <Route path="/clients"   element={<Clients />}    />
          <Route path="/projects"  element={<Projects />}   />
          <Route path="/tasks"     element={<Tasks />}      />
          <Route path="/payments"  element={<Payments />}   />
        </Route>

        {/* Catch all — 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  )
}
