import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/payments', label: 'Payments' },
]

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">SoloSync</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-8 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Logout
      </button>
    </aside>
  )
}
