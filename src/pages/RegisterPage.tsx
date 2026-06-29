import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthProvider'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, startGoogleLogin, authError } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const form = new FormData(event.currentTarget)
    const password = String(form.get('password'))

    try {
      await register({
        name: String(form.get('name')),
        email: String(form.get('email')),
        password,
        password_confirmation: password,
      })
      navigate('/dashboard', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Start sharing</p>
          <h1>Create your account</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" placeholder="Demo User" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="demo@gmail.com" required />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength={8} placeholder="At least 8 characters" required />
          </label>

          {authError ? <p className="form-error">{authError}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
          <button className="secondary-button" type="button" onClick={startGoogleLogin}>
            Continue with Google
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}
