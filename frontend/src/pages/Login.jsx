import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../store/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) navigate('/')
    return () => dispatch(clearError())
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0F1E',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: '#F8FAFC' }}>
              Job<span style={{ color: '#F59E0B' }}>Connect</span>
            </span>
          </Link>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '2rem',
            fontWeight: 700, color: '#F8FAFC', marginTop: '1.5rem', marginBottom: '0.5rem'
          }}>Welcome back</h1>
          <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.95rem' }}>
            Login to your account to continue
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '20px', padding: '2.5rem'
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', fontFamily: 'DM Sans', fontSize: '0.9rem',
              padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block', fontFamily: 'DM Sans', fontWeight: 500,
                color: '#CBD5E1', fontSize: '0.875rem', marginBottom: '0.5rem'
              }}>Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="you@example.com"
                style={{
                  width: '100%', background: '#1A2235', border: '1px solid #1E293B',
                  color: '#F8FAFC', fontFamily: 'DM Sans', fontSize: '0.95rem',
                  padding: '0.8rem 1rem', borderRadius: '10px', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block', fontFamily: 'DM Sans', fontWeight: 500,
                color: '#CBD5E1', fontSize: '0.875rem', marginBottom: '0.5rem'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} required placeholder="••••••••"
                  style={{
                    width: '100%', background: '#1A2235', border: '1px solid #1E293B',
                    color: '#F8FAFC', fontFamily: 'DM Sans', fontSize: '0.95rem',
                    padding: '0.8rem 3rem 0.8rem 1rem', borderRadius: '10px', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#64748B', fontSize: '1.1rem', padding: 0,
                    display: 'flex', alignItems: 'center'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? '#92400E' : 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#0A0F1E', fontFamily: 'DM Sans', fontWeight: 700,
              fontSize: '1rem', padding: '0.9rem', borderRadius: '10px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.01em'
            }}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', fontFamily: 'DM Sans',
            color: '#64748B', fontSize: '0.9rem', marginTop: '1.5rem'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 500 }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login