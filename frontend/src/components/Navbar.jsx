import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav style={{
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1E293B',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }} className="px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: '-0.02em'
          }}>
            Job<span style={{ color: '#F59E0B' }}>Connect</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/jobs" style={{
            color: '#94A3B8',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            fontSize: '0.95rem',
            textDecoration: 'none'
          }}
            onMouseEnter={e => e.target.style.color = '#F8FAFC'}
            onMouseLeave={e => e.target.style.color = '#94A3B8'}>
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link to="/login" style={{
                color: '#94A3B8',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                fontSize: '0.95rem',
                textDecoration: 'none'
              }}
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
                letterSpacing: '0.01em'
              }}>
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user.role === 'employer' && (
                <>
                  <Link to="/post-job" style={{ color: '#94A3B8', textDecoration: 'none', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.95rem' }}
                    onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                    onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                    Post Job
                  </Link>
                  <Link to="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.95rem' }}
                    onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                    onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                    Dashboard
                  </Link>
                </>
              )}
              {user.role === 'jobseeker' && (
                <Link to="/applications" style={{ color: '#94A3B8', textDecoration: 'none', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.95rem' }}
                  onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                  onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                  My Applications
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: '#94A3B8', textDecoration: 'none', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.95rem' }}
                  onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                  onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                  Admin
                </Link>
              )}

              <div className="flex items-center gap-3">
                <span style={{
                  fontFamily: 'DM Sans',
                  fontWeight: 500,
                  color: '#F8FAFC',
                  fontSize: '0.9rem'
                }}>{user.name}</span>
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
      </div>
    </nav>
  )
}

export default Navbar