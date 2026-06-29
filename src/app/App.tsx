import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AiPage } from '../pages/AiPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { PublicFilePage } from '../pages/PublicFilePage'
import { RegisterPage } from '../pages/RegisterPage'
import { WalletPage } from '../pages/WalletPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/f/:code" element={<PublicFilePage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai" element={<AiPage />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
