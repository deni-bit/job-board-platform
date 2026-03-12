import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setMenuOpen(false)
  }

  const linkStyle = {
    color: '#94A3B8',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '0.95rem',
    textDecoration: 'none',
    padding: '0.4rem 0',
    display: 'block'
  }

  return (
    <nav style={{
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1E293B',
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
          color: '#F8FAFC',
          letterSpacing: '-0.02em',
          textDecoration: 'none'
        }}>
          Job<span style={{ color: '#F59E0B' }}>Connect</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/jobs" style={{ ...linkStyle, display: 'inline' }}
            onMouseEnter={e => e.target.style.color = '#F8FAFC'}
            onMouseLeave={e => e.target.style.color = '#94A3B8'}>
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link to="/login" style={{ ...linkStyle, display: 'inline' }}
                onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                onMouseLeave={e => e.target.style.color = '#94A3B8'}>
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
                    onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                    onMouseLeave={e => e.target.style.color = '#94A3B8'}>Post Job</Link>
                  <Link to="/dashboard" style={{ ...linkStyle, display: 'inline' }}
                    onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                    onMouseLeave={e => e.target.style.color = '#94A3B8'}>Dashboard</Link>
                </>
              )}
              {user.role === 'jobseeker' && (
                <Link to="/applications" style={{ ...linkStyle, display: 'inline' }}
                  onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                  onMouseLeave={e => e.target.style.color = '#94A3B8'}>My Applications</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" style={{ ...linkStyle, display: 'inline' }}
                  onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                  onMouseLeave={e => e.target.style.color = '#94A3B8'}>Admin</Link>
              )}
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: 'DM Sans', fontWeight: 500, color: '#F8FAFC', fontSize: '0.9rem' }}>
                  {user.name}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#F59E0B',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>{user.role}</span>
                <button onClick={handleLogout} style={{
                  background: 'transparent',
                  border: '1px solid #1E293B',
                  color: '#94A3B8',
                  fontFamily: 'DM Sans',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.target.style.borderColor = '#EF4444'; e.target.style.color = '#EF4444' }}
                  onMouseLeave={e => { e.target.style.borderColor = '#1E293B'; e.target.style.color = '#94A3B8' }}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hamburger Button — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span style={{
            display: 'block', width: '24px', height: '2px',
            background: '#F8FAFC',
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none'
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px',
            background: '#F8FAFC',
            transition: 'all 0.3s',
            opacity: menuOpen ? 0 : 1
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px',
            background: '#F8FAFC',
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none'
          }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#0A0F1E',
          borderTop: '1px solid #1E293B',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          <Link to="/jobs" style={linkStyle} onClick={() => setMenuOpen(false)}>Browse Jobs</Link>

          {!user ? (
            <>
              <Link to="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#0A0F1E',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '0.6rem 1.4rem',
                borderRadius: '8px',
                textDecoration: 'none',
              }}>
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* User info */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 0', borderBottom: '1px solid #1E293B', marginBottom: '0.75rem'
              }}>
                <span style={{ color: '#F8FAFC', fontFamily: 'DM Sans', fontWeight: 600 }}>{user.name}</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                  background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',
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
                marginTop: '0.75rem',
                background: 'transparent',
                border: '1px solid #EF4444',
                color: '#EF4444',
                fontFamily: 'DM Sans',
                fontWeight: 500,
                fontSize: '0.9rem',
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%'
              }}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar