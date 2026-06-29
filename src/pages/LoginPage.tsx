import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthProvider'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, startGoogleLogin, authError } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const form = new FormData(event.currentTarget)

    try {
      await login({
        email: String(form.get('email')),
        password: String(form.get('password')),
      })

      const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/dashboard'
      navigate(from, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to PasteLink</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" placeholder="demo@gmail.com" required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="password" required />
          </label>

          {authError ? <p className="form-error">{authError}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
          <button className="secondary-button" type="button" onClick={startGoogleLogin}>
            Continue with Google
          </button>
        </form>

        <p className="auth-switch">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  )
}
