import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const stats = [
  { number: '1,200+', label: 'Active Jobs' },
  { number: '500+', label: 'Companies Hiring' },
  { number: '10,000+', label: 'Job Seekers' },
  { number: '850+', label: 'Hired This Month' },
]

const features = [
  { icon: '⚡', title: 'Real-time Alerts', desc: 'Instant notifications the moment an employer views or updates your application.' },
  { icon: '📄', title: 'One-click Apply', desc: 'Upload your CV once. Apply to unlimited jobs with a single click.' },
  { icon: '🎯', title: 'Smart Search', desc: 'Filter by location, salary, job type and skills to find your perfect match.' },
]

const Home = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 4rem', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          color: '#F59E0B',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          padding: '0.4rem 1rem',
          borderRadius: '100px',
          marginBottom: '2rem',
          textTransform: 'uppercase'
        }}>
          <span style={{ width: '6px', height: '6px', background: '#F59E0B', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          1,200+ Jobs Available Now
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 700,
          color: '#F8FAFC',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem'
        }}>
          Find Your Dream<br />
          <span style={{
            background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Career.</span>
        </h1>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.2rem',
          color: '#94A3B8',
          maxWidth: '560px',
          margin: '0 auto 3rem',
          lineHeight: 1.7,
          fontWeight: 400
        }}>
          Connect with top employers across Africa and beyond.
          Upload your CV. Get hired faster than ever before.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/jobs" style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0A0F1E',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '0.9rem 2.5rem',
            borderRadius: '12px',
            textDecoration: 'none',
            letterSpacing: '0.01em'
          }}>
            Browse Jobs →
          </Link>
          {!user && (
            <Link to="/register" style={{
              background: 'transparent',
              color: '#F8FAFC',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.9rem 2.5rem',
              borderRadius: '12px',
              textDecoration: 'none',
              border: '1px solid #1E293B'
            }}>
              Create Account
            </Link>
          )}
          {user?.role === 'employer' && (
            <Link to="/post-job" style={{
              background: 'transparent',
              color: '#F8FAFC',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.9rem 2.5rem',
              borderRadius: '12px',
              textDecoration: 'none',
              border: '1px solid #1E293B'
            }}>
              Post a Job
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: '#111827',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.5rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.5rem'
              }}>{stat.number}</div>
              <div style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.9rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#F8FAFC',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>Why JobConnect?</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: '#111827',
              border: '1px solid #1E293B',
              borderRadius: '20px',
              padding: '2.5rem',
              cursor: 'default'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1E293B'}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.2rem' }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#F8FAFC',
                marginBottom: '0.75rem'
              }}>{f.title}</h3>
              <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', lineHeight: 1.7, fontSize: '0.95rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #1E293B',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'DM Sans',
        color: '#475569',
        fontSize: '0.85rem'
      }}>
        © 2026 JobConnect — Built by Denis Steven Daudi
      </div>

    </div>
  )
}

export default Home