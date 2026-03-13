import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

const CompanyProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/auth/company/${id}`)
        setData(res.data)
      } catch (err) {
        setError('Company not found')
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>Loading company...</p>
    </div>
  )

  if (error || !data) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>Company not found</p>
    </div>
  )

  const { employer, jobs } = data

  const typeColors = {
    'full-time': '#4ADE80',
    'part-time': '#60A5FA',
    'contract': '#FCD34D',
    'remote': '#C084FC',
  }

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          fontFamily: 'DM Sans', fontSize: '0.9rem', cursor: 'pointer',
          marginBottom: '2rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>← Back</button>

        {/* Company Header */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '2.5rem', marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>

            {/* Logo */}
            <div style={{
              width: '90px', height: '90px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 700, color: 'var(--navy)',
              fontFamily: 'DM Sans', flexShrink: 0, overflow: 'hidden'
            }}>
              {employer.companyLogo
                ? <img src={employer.companyLogo} alt={employer.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : employer.company?.charAt(0).toUpperCase()
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <h1 style={{
                  fontFamily: 'Playfair Display, serif', fontSize: '2rem',
                  fontWeight: 700, color: 'var(--text)'
                }}>{employer.company || employer.name}</h1>
                {employer.isVerified && (
                  <span style={{
                    background: 'rgba(16,185,129,0.1)', color: '#10B981',
                    border: '1px solid rgba(16,185,129,0.3)',
                    fontFamily: 'DM Sans', fontSize: '0.75rem', fontWeight: 600,
                    padding: '0.2rem 0.6rem', borderRadius: '4px'
                  }}>✓ Verified</span>
                )}
              </div>

              {employer.companyIndustry && (
                <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  {employer.companyIndustry}
                </p>
              )}

              {/* Company Tags */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {employer.companyLocation && (
                  <span style={{
                    background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)',
                    fontFamily: 'DM Sans', fontSize: '0.8rem',
                    padding: '0.25rem 0.7rem', borderRadius: '4px'
                  }}>📍 {employer.companyLocation}</span>
                )}
                {employer.companySize && (
                  <span style={{
                    background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)',
                    fontFamily: 'DM Sans', fontSize: '0.8rem',
                    padding: '0.25rem 0.7rem', borderRadius: '4px'
                  }}>👥 {employer.companySize} employees</span>
                )}
                {employer.companyFoundedYear && (
                  <span style={{
                    background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)',
                    fontFamily: 'DM Sans', fontSize: '0.8rem',
                    padding: '0.25rem 0.7rem', borderRadius: '4px'
                  }}>📅 Founded {employer.companyFoundedYear}</span>
                )}
                <span style={{
                  background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
                  border: '1px solid rgba(245,158,11,0.3)',
                  fontFamily: 'DM Sans', fontSize: '0.8rem',
                  padding: '0.25rem 0.7rem', borderRadius: '4px'
                }}>💼 {jobs.length} open position{jobs.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Website Button */}
            {employer.companyWebsite && (
              <a href={employer.companyWebsite} target="_blank" rel="noreferrer" style={{
                background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
                border: '1px solid rgba(245,158,11,0.3)',
                fontFamily: 'DM Sans', fontSize: '0.9rem', fontWeight: 600,
                padding: '0.6rem 1.25rem', borderRadius: '8px',
                textDecoration: 'none', whiteSpace: 'nowrap'
              }}>🌐 Visit Website</a>
            )}
          </div>

          {/* Description */}
          {employer.companyDescription && (
            <div style={{
              marginTop: '1.5rem', paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)'
            }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif', fontSize: '1.1rem',
                color: 'var(--text)', marginBottom: '0.75rem'
              }}>About the Company</h2>
              <p style={{
                fontFamily: 'DM Sans', color: 'var(--muted)',
                lineHeight: 1.8, fontSize: '0.95rem'
              }}>{employer.companyDescription}</p>
            </div>
          )}
        </div>

        {/* Open Positions */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '2rem'
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '1.4rem',
            color: 'var(--text)', marginBottom: '1.25rem'
          }}>
            Open Positions
            <span style={{
              fontFamily: 'DM Sans', fontSize: '0.9rem',
              color: 'var(--muted)', fontWeight: 400, marginLeft: '0.75rem'
            }}>{jobs.length} available</span>
          </h2>

          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💼</div>
              <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>No open positions at the moment</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.map(job => (
                <Link key={job._id} to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--navy)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '1.25rem',
                    transition: 'border-color 0.2s',
                    cursor: 'pointer'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h3 style={{
                          fontFamily: 'Playfair Display, serif', fontSize: '1rem',
                          color: 'var(--text)', marginBottom: '0.3rem'
                        }}>{job.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{
                            background: 'var(--surface2)', color: 'var(--muted)',
                            fontFamily: 'DM Sans', fontSize: '0.8rem',
                            padding: '0.2rem 0.6rem', borderRadius: '4px'
                          }}>📍 {job.location}</span>
                          <span style={{
                            background: 'rgba(245,158,11,0.08)',
                            color: typeColors[job.type] || '#F59E0B',
                            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                            padding: '0.2rem 0.6rem', borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>{job.type}</span>
                          {job.salary?.min > 0 && (
                            <span style={{
                              background: 'rgba(34,197,94,0.08)', color: '#4ADE80',
                              fontFamily: 'DM Sans', fontSize: '0.8rem',
                              padding: '0.2rem 0.6rem', borderRadius: '4px'
                            }}>${job.salary.min.toLocaleString()} — ${job.salary.max.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <span style={{
                        color: '#F59E0B', fontFamily: 'DM Sans',
                        fontSize: '0.85rem', fontWeight: 600
                      }}>Apply →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CompanyProfile