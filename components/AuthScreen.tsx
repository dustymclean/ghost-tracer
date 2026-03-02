import { useState } from 'react'
import { supabase } from '../src/lib/supabase'

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sitePassword, setSitePassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        // 1. Ask the database if the site password is correct
        const { data: isPasswordCorrect, error: rpcError } = await supabase
          .rpc('verify_site_password', { attempt: sitePassword })

        if (rpcError) throw rpcError
        
        if (!isPasswordCorrect) {
          throw new Error('Invalid site registration password.')
        }

        // 2. If correct, proceed with Supabase sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
        
        alert('Success! Check your email for the confirmation link.')
      } else {
        // Handle standard Log In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
          {isSignUp ? 'Create an Account' : 'Sign in to GhostTrace'}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-slate-500 focus:border-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-slate-500 focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Only show the Site Password requirement if they are trying to sign up */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Registration Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                value={sitePassword}
                onChange={(e) => setSitePassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSitePassword('')
            }}
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}