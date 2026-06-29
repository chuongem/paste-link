import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AUTH_TOKEN_STORAGE_KEY, API_BASE_URL, getApiErrorMessage } from '../../api/client'
import * as authApi from './authApi'
import type { LoginPayload, RegisterPayload, User } from './types'

type AuthContextValue = {
  user: User | null
  token: string | null
  isBootstrapping: boolean
  authError: string | null
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  startGoogleLogin: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token))
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false)
      return
    }

    // Restore the current user when the page refreshes and a token exists.
    authApi
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsBootstrapping(false))
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isBootstrapping,
      authError,
      async login(payload) {
        setAuthError(null)

        try {
          const response = await authApi.login(payload)
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.data.access_token)
          setToken(response.data.access_token)
          setUser(response.data.user)
        } catch (error) {
          setAuthError(getApiErrorMessage(error))
          throw error
        }
      },
      async register(payload) {
        setAuthError(null)

        try {
          const response = await authApi.register(payload)
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.data.access_token)
          setToken(response.data.access_token)
          setUser(response.data.user)
        } catch (error) {
          setAuthError(getApiErrorMessage(error))
          throw error
        }
      },
      async logout() {
        try {
          await authApi.logout()
        } finally {
          // Always clear local auth state, even when the server token is already expired.
          localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
          setToken(null)
          setUser(null)
        }
      },
      startGoogleLogin() {
        window.location.href = `${API_BASE_URL}/auth/google/redirect`
      },
    }),
    [authError, isBootstrapping, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
