import { useEffect, useState } from 'react'
import api from '../utils/api'

const statusColors = {
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
  reviewed: { bg: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: 'rgba(59,130,246,0.3)' },
  shortlisted: { bg: 'rgba(168,85,247,0.1)', color: '#C084FC', border: 'rgba(168,85,247,0.3)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: 'rgba(239,68,68,0.3)' },
  hired: { bg: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: 'rgba(34,197,94,0.3)' },
}

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/applications/mine')
        setApplications(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '2.5rem',
            fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem'
          }}>My Applications</h1>
          <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>
            {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem'
        }}>
          {[
            { label: 'Total', value: applications.length, color: 'var(--text)' },
            { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: '#FCD34D' },
            { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: '#C084FC' },
            { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, color: '#4ADE80' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.25rem', textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif', fontSize: '2rem',
                fontWeight: 700, color: stat.color, marginBottom: '0.25rem'
              }}>{stat.value}</div>
              <div style={{ fontFamily: 'DM Sans', color: 'var(--muted)', fontSize: '0.85rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>Loading...</p>
        ) : applications.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '4rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.3rem',
              color: 'var(--text)', marginBottom: '0.5rem'
            }}>No applications yet</p>
            <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>
              Browse jobs and start applying!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map(app => {
              const s = statusColors[app.status] || statusColors.pending
              return (
                <div key={app._id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Playfair Display, serif', fontSize: '1.2rem',
                        color: 'var(--text)', marginBottom: '0.3rem'
                      }}>{app.job?.title}</h3>
                      <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                        {app.job?.company} · {app.job?.location} · {app.job?.type}
                      </p>

                      {/* Salary */}
                      {app.job?.salary?.min > 0 && (
                        <span style={{
                          background: 'rgba(34,197,94,0.08)', color: '#4ADE80',
                          border: '1px solid rgba(34,197,94,0.2)',
                          fontFamily: 'DM Sans', fontSize: '0.8rem',
                          padding: '0.2rem 0.6rem', borderRadius: '4px',
                          marginRight: '0.5rem'
                        }}>
                          ${app.job.salary.min.toLocaleString()} — ${app.job.salary.max.toLocaleString()}
                        </span>
                      )}

                      <span style={{
                        background: 'var(--surface2)', color: '#64748B',
                        fontFamily: 'DM Sans', fontSize: '0.8rem',
                        padding: '0.2rem 0.6rem', borderRadius: '4px',
                        border: '1px solid var(--border)'
                      }}>Applied {timeAgo(app.createdAt)}</span>
                    </div>

                    {/* Status badge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                      <span style={{
                        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                        fontWeight: 600, padding: '0.35rem 0.85rem',
                        borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.06em'
                      }}>{app.status}</span>

                      {app.resume && (
                        <a href={app.resume} target="_blank" rel="noreferrer" style={{
                          background: 'rgba(245,158,11,0.08)', color: '#F59E0B',
                          border: '1px solid rgba(245,158,11,0.2)',
                          fontFamily: 'DM Sans', fontSize: '0.8rem', fontWeight: 500,
                          padding: '0.3rem 0.75rem', borderRadius: '6px',
                          textDecoration: 'none'
                        }}>📄 My CV</a>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter preview */}
                  {app.coverLetter && (
                    <div style={{
                      marginTop: '1rem', paddingTop: '1rem',
                      borderTop: '1px solid var(--border)'
                    }}>
                      <p style={{
                        fontFamily: 'DM Sans', color: '#64748B',
                        fontSize: '0.8rem', fontWeight: 500,
                        marginBottom: '0.4rem', textTransform: 'uppercase',
                        letterSpacing: '0.06em'
                      }}>Cover Letter</p>
                      <p style={{
                        fontFamily: 'DM Sans', color: 'var(--muted)',
                        fontSize: '0.9rem', lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Applications