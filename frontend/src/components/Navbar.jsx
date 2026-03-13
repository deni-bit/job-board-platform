import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setMenuOpen(false)
  }

  const linkStyle = {
    color: 'var(--muted)',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '0.95rem',
    textDecoration: 'none',
    padding: '0.4rem 0',
    display: 'block'
  }

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '0.4rem 0.6rem',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )

  return (
    <nav style={{
      background: theme === 'dark' ? 'rgba(10, 15, 30, 0.95)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)} style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          textDecoration: 'none'
        }}>
          Job<span style={{ color: 'var(--gold)' }}>Connect</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/jobs" style={{ ...linkStyle, display: 'inline' }}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link to="/login" style={{ ...linkStyle, display: 'inline' }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
                Login
              </Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#0A0F1E',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                textDecoration: 'none',
              }}>
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user.role === 'employer' && (
                <>
                  <Link to="/post-job" style={{ ...linkStyle, display: 'inline' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted)'}>Post Job</Link>
                  <Link to="/dashboard" style={{ ...linkStyle, display: 'inline' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted)'}>Dashboard</Link>
                </>
              )}
              {user.role === 'jobseeker' && (
                <Link to="/applications" style={{ ...linkStyle, display: 'inline' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--muted)'}>My Applications</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" style={{ ...linkStyle, display: 'inline' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--muted)'}>Admin</Link>
              )}
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: 'DM Sans', fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem' }}>
                  {user.name}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--gold)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>{user.role}</span>
                <button onClick={handleLogout} style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  fontFamily: 'DM Sans',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.target.style.borderColor = '#EF4444'; e.target.style.color = '#EF4444' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}>
                  Logout
                </button>
              </div>
            </>
          )}

          {/* Theme Toggle — desktop only */}
          <ThemeToggle />
        </div>

        {/* Mobile right side — toggle + hamburger */}
        <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{
                display: 'block', width: '24px', height: '2px',
                background: 'var(--text)', transition: 'all 0.3s',
                transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none'
              }} />
              <span style={{
                display: 'block', width: '24px', height: '2px',
                background: 'var(--text)', transition: 'all 0.3s',
                opacity: menuOpen ? 0 : 1
              }} />
              <span style={{
                display: 'block', width: '24px', height: '2px',
                background: 'var(--text)', transition: 'all 0.3s',
                transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'
              }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--navy)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          <Link to="/jobs" style={linkStyle} onClick={() => setMenuOpen(false)}>Browse Jobs</Link>

          {!user ? (
            <>
              <Link to="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                display: 'inline-block', marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#0A0F1E', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, fontSize: '0.9rem',
                padding: '0.6rem 1.4rem', borderRadius: '8px', textDecoration: 'none',
              }}>Get Started</Link>
            </>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 0', borderBottom: '1px solid var(--border)', marginBottom: '0.75rem'
              }}>
                <span style={{ color: 'var(--text)', fontFamily: 'DM Sans', fontWeight: 600 }}>{user.name}</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                  background: 'rgba(245, 158, 11, 0.15)', color: 'var(--gold)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.15rem 0.5rem', borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>{user.role}</span>
              </div>
              {user.role === 'employer' && (
                <>
                  <Link to="/post-job" style={linkStyle} onClick={() => setMenuOpen(false)}>Post Job</Link>
                  <Link to="/dashboard" style={linkStyle} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                </>
              )}
              {user.role === 'jobseeker' && (
                <Link to="/applications" style={linkStyle} onClick={() => setMenuOpen(false)}>My Applications</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" style={linkStyle} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} style={{
                marginTop: '0.75rem', background: 'transparent',
                border: '1px solid #EF4444', color: '#EF4444',
                fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.9rem',
                padding: '0.5rem 1.2rem', borderRadius: '8px',
                cursor: 'pointer', width: '100%'
              }}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar