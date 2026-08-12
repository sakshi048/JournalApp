'use client'

import { useState } from 'react'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'

interface AuthFormProps {
  type: 'login' | 'signup'
  onSuccess: (token: string) => void
  onBack: () => void
}

export default function AuthForm({ type, onSuccess, onBack }: AuthFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (type === 'signup') {
      if (!username || !email || !password || !confirmPassword) {
        setError('All fields are required')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email')
        return
      }
    } else {
      if (!username || !password) {
        setError('Username and password are required')
        return
      }
    }

    setLoading(true)

    try {
      if (type === 'signup') {
        await api.signup(username, password)
        // After signup, login automatically
        const token = await api.login(username, password)
        onSuccess(token)
      } else {
        const token = await api.login(username, password)
        onSuccess(token)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMsg || 'Authentication failed. Please try again.')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex flex-col items-center justify-center p-4">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
              <BookOpen size={24} className="text-amber-50" />
            </div>
          </div>
          <h1 className="font-serif text-3xl text-amber-900 mb-2">JournalApp</h1>
          <p className="text-amber-700">
            {type === 'signup' ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-amber-200">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p className="font-semibold mb-1">Error</p>
              {error}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={loading}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent disabled:bg-amber-50"
            />
            {type === 'signup' && <p className="text-xs text-amber-600 mt-1">This will be your unique identifier</p>}
          </div>

          {/* Email Field (Signup Only) */}
          {type === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent disabled:bg-amber-50"
              />
              <p className="text-xs text-amber-600 mt-1">We'll use this for account recovery</p>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={type === 'signup' ? 'Create a strong password' : 'Enter password'}
              disabled={loading}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent disabled:bg-amber-50"
            />
            {type === 'signup' && <p className="text-xs text-amber-600 mt-1">At least 6 characters</p>}
          </div>

          {/* Confirm Password Field (Signup Only) */}
          {type === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                disabled={loading}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent disabled:bg-amber-50"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (type === 'signup' ? !username || !email || !password || !confirmPassword : !username || !password)}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-50 rounded-full animate-spin" />
                Processing...
              </span>
            ) : type === 'signup' ? (
              'Create Account'
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-amber-700 mt-6">
          {type === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={onBack}
            className="ml-2 text-amber-700 font-semibold hover:text-amber-900 transition-colors"
          >
            {type === 'signup' ? 'Login here' : 'Sign up here'}
          </button>
        </p>

        {/* Privacy Notice */}
        <p className="text-center text-xs text-amber-600 mt-4">
          Your information is secure and private. We never share your data.
        </p>
      </div>
    </div>
  )
}

