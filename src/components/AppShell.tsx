import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogOut, UploadCloud, WalletCards, WandSparkles } from 'lucide-react'
import { useAuth } from '../features/auth/AuthProvider'

export function AppShell() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/dashboard">
          <span className="brand-mark">P</span>
          <span>
            <strong>PasteLink</strong>
            <small>Paste Anything. Get a Link.</small>
          </span>
        </Link>

        <nav className="topnav" aria-label="Main navigation">
          <NavLink to="/dashboard">
            <UploadCloud size={18} />
            Upload
          </NavLink>
          <NavLink to="/ai">
            <WandSparkles size={18} />
            AI
          </NavLink>
          <NavLink to="/wallet">
            <WalletCards size={18} />
            Wallet
          </NavLink>
        </nav>

        <div className="user-menu">
          <span>{user?.name ?? 'User'}</span>
          <button className="icon-button" type="button" onClick={logout} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="shell-content">
        <Outlet />
      </main>
    </div>
  )
}
