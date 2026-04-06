import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../api/auth.api'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const { login }    = useAuth()
  const navigate     = useNavigate()

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const apiFn = isRegister ? registerUser : loginUser
      const { data } = await apiFn(form)

      // Store in context + localStorage
      login(data.user, data.token)

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">SoloSync</h1>
        <p className="text-gray-500 text-sm mb-6">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Full name" required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )}
          <input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="Email address" required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="password" type="password" value={form.password} onChange={handleChange}
            placeholder="Password" required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsRegister(!isRegister); setError('') }}
            className="text-blue-600 ml-1 hover:underline">
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}