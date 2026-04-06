import { createContext, useContext, useState, useEffect } from 'react'

// 1. Create the context object
const AuthContext = createContext(null)

// 2. Provider component — wraps the whole app
export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // 3. On app load — restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('solosync_token')
    const savedUser  = localStorage.getItem('solosync_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)  // done checking localStorage
  }, [])  // empty array = runs once on mount

  // 4. Login — called from Login.jsx after API success
  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('solosync_token', jwtToken)
    localStorage.setItem('solosync_user', JSON.stringify(userData))
  }

  // 5. Logout — clear everything
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('solosync_token')
    localStorage.removeItem('solosync_user')
  }

  // 6. Don't render children until we've checked localStorage
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 7. Custom hook — makes using context clean
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}