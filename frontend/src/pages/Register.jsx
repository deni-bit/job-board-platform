import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../store/authSlice'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker', company: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) navigate('/')
    return () => dispatch(clearError())
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(form))
  }

  const inputStyle = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
    padding: '0.8rem 1rem', borderRadius: '10px', outline: 'none', boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
    color: '#CBD5E1', fontSize: '0.875rem', marginBottom: '0.5rem'
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)' }}>
              Job<span style={{ color: '#F59E0B' }}>Connect</span>
            </span>
          </Link>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '2rem',
            fontWeight: 700, color: 'var(--text)', marginTop: '1.5rem', marginBottom: '0.5rem'
          }}>Create your account</h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--muted)', fontSize: '0.95rem' }}>
            Join thousands of professionals on JobConnect
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
              padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Toggle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['jobseeker', 'employer'].map((role) => (
                  <button key={role} type="button"
                    onClick={() => setForm({ ...form, role })}
                    style={{
                      padding: '0.85rem', borderRadius: '10px',
                      border: form.role === role ? '1px solid #F59E0B' : '1px solid var(--border)',
                      background: form.role === role ? 'rgba(245,158,11,0.1)' : 'var(--surface2)',
                      color: form.role === role ? '#F59E0B' : 'var(--muted)',
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                      fontSize: '0.9rem', cursor: 'pointer', textTransform: 'capitalize'
                    }}>
                    {role === 'jobseeker' ? '🔍 Job Seeker' : '🏢 Employer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={form.name}
                onChange={handleChange} required placeholder="Denis Steven"
                style={inputStyle} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Email address</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="you@example.com"
                style={inputStyle} />
            </div>

            {/* Company — employer only */}
            {form.role === 'employer' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Company Name</label>
                <input type="text" name="company" value={form.company}
                  onChange={handleChange} required placeholder="TechCorp Ltd"
                  style={inputStyle} />
              </div>
            )}

            {/* Password with show/hide */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} required placeholder="Min. 6 characters"
                  style={{ ...inputStyle, padding: '0.8rem 3rem 0.8rem 1rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--muted)', fontSize: '1.1rem', padding: 0,
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
              color: 'var(--navy)', fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
              fontSize: '1rem', padding: '0.9rem', borderRadius: '10px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', fontFamily: 'DM Sans, sans-serif',
            color: '#64748B', fontSize: '0.9rem', marginTop: '1.5rem'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 500 }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register