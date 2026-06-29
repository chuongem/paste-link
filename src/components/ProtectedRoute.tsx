import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthProvider'

export function ProtectedRoute() {
  const location = useLocation()
  const { token, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return <div className="screen-loader">Loading your workspace...</div>
  }

  // Preserve the original target so login can send the user back afterward.
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
