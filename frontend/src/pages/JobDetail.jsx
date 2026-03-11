import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobById } from '../store/jobsSlice'
import api from '../utils/api'

const JobDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentJob: job, loading } = useSelector((state) => state.jobs)
  const { user } = useSelector((state) => state.auth)

  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ coverLetter: '' })
  const [resumeFile, setResumeFile] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchJobById(id))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')

    setApplying(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('coverLetter', form.coverLetter)
      if (resumeFile) formData.append('resume', resumeFile)

      await api.post(`/applications/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setApplied(true)
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  const typeColors = {
    'full-time': '#4ADE80',
    'part-time': '#60A5FA',
    'contract': '#FCD34D',
    'remote': '#C084FC',
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '1rem' }}>Loading job...</p>
    </div>
  )

  if (!job) return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>Job not found</p>
    </div>
  )

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate('/jobs')} style={{
          background: 'none', border: 'none', color: '#94A3B8',
          fontFamily: 'DM Sans', fontSize: '0.9rem', cursor: 'pointer',
          marginBottom: '2rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>← Back to Jobs</button>

        {/* Header Card */}
        <div style={{
          background: '#111827',
          border: job.isFeatured ? '1px solid rgba(245,158,11,0.4)' : '1px solid #1E293B',
          borderRadius: '20px', padding: '2.5rem', marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              {job.isFeatured && (
                <span style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#0A0F1E', fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem', fontWeight: 700,
                  padding: '0.2rem 0.6rem', borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  display: 'inline-block', marginBottom: '0.75rem'
                }}>⭐ Featured</span>
              )}
              <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                {job.company}
              </p>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.2rem', fontWeight: 700,
                color: '#F8FAFC', lineHeight: 1.2, marginBottom: '1rem'
              }}>{job.title}</h1>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(245,158,11,0.1)', color: typeColors[job.type] || '#F59E0B',
                  border: `1px solid rgba(245,158,11,0.2)`,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                  padding: '0.3rem 0.75rem', borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>{job.type}</span>

                <span style={{
                  background: '#1A2235', color: '#94A3B8', border: '1px solid #1E293B',
                  fontFamily: 'DM Sans', fontSize: '0.85rem',
                  padding: '0.3rem 0.75rem', borderRadius: '4px'
                }}>📍 {job.location}</span>

                {job.salary?.min > 0 && (
                  <span style={{
                    background: 'rgba(34,197,94,0.08)', color: '#4ADE80',
                    border: '1px solid rgba(34,197,94,0.2)',
                    fontFamily: 'DM Sans', fontSize: '0.85rem',
                    padding: '0.3rem 0.75rem', borderRadius: '4px'
                  }}>
                    ${job.salary.min.toLocaleString()} — ${job.salary.max.toLocaleString()} {job.salary.currency}
                  </span>
                )}

                <span style={{
                  background: '#1A2235', color: '#64748B', border: '1px solid #1E293B',
                  fontFamily: 'DM Sans', fontSize: '0.8rem',
                  padding: '0.3rem 0.75rem', borderRadius: '4px'
                }}>{job.applicantsCount} applicants</span>

                <span style={{
                  background: '#1A2235', color: '#64748B', border: '1px solid #1E293B',
                  fontFamily: 'DM Sans', fontSize: '0.8rem',
                  padding: '0.3rem 0.75rem', borderRadius: '4px'
                }}>Posted {timeAgo(job.createdAt)}</span>
              </div>
            </div>

            {/* Apply Button */}
            <div>
              {user?.role === 'jobseeker' && !applied && (
                <button onClick={() => setShowForm(!showForm)} style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#0A0F1E', fontFamily: 'DM Sans', fontWeight: 700,
                  fontSize: '1rem', padding: '0.85rem 2rem',
                  borderRadius: '12px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>
                  {showForm ? 'Cancel' : 'Apply Now →'}
                </button>
              )}
              {applied && (
                <div style={{
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                  color: '#4ADE80', fontFamily: 'DM Sans', fontWeight: 600,
                  padding: '0.85rem 2rem', borderRadius: '12px', fontSize: '0.95rem'
                }}>✓ Applied!</div>
              )}
              {!user && (
                <button onClick={() => navigate('/login')} style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#0A0F1E', fontFamily: 'DM Sans', fontWeight: 700,
                  fontSize: '1rem', padding: '0.85rem 2rem',
                  borderRadius: '12px', border: 'none', cursor: 'pointer'
                }}>Login to Apply</button>
              )}
            </div>
          </div>
        </div>

        {/* Apply Form */}
        {showForm && (
          <div style={{
            background: '#111827', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.5rem',
              color: '#F8FAFC', marginBottom: '1.5rem'
            }}>Submit Application</h2>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#FCA5A5', fontFamily: 'DM Sans', fontSize: '0.9rem',
                padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem'
              }}>{error}</div>
            )}

            <form onSubmit={handleApply}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block', fontFamily: 'DM Sans', fontWeight: 500,
                  color: '#CBD5E1', fontSize: '0.875rem', marginBottom: '0.5rem'
                }}>Cover Letter</label>
                <textarea
                  value={form.coverLetter}
                  onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                  required rows={5}
                  placeholder="Tell the employer why you're a great fit..."
                  style={{
                    width: '100%', background: '#1A2235', border: '1px solid #1E293B',
                    color: '#F8FAFC', fontFamily: 'DM Sans', fontSize: '0.95rem',
                    padding: '0.85rem 1rem', borderRadius: '10px', outline: 'none',
                    resize: 'vertical', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{
                  display: 'block', fontFamily: 'DM Sans', fontWeight: 500,
                  color: '#CBD5E1', fontSize: '0.875rem', marginBottom: '0.5rem'
                }}>Upload CV/Resume (PDF)</label>
                <input
                  type="file" accept=".pdf,.jpg,.png"
                  onChange={e => setResumeFile(e.target.files[0])}
                  style={{
                    width: '100%', background: '#1A2235', border: '1px solid #1E293B',
                    color: '#94A3B8', fontFamily: 'DM Sans', fontSize: '0.9rem',
                    padding: '0.75rem 1rem', borderRadius: '10px',
                    boxSizing: 'border-box', cursor: 'pointer'
                  }}
                />
              </div>

              <button type="submit" disabled={applying} style={{
                background: applying ? '#92400E' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#0A0F1E', fontFamily: 'DM Sans', fontWeight: 700,
                fontSize: '1rem', padding: '0.85rem 2.5rem',
                borderRadius: '10px', border: 'none', cursor: applying ? 'not-allowed' : 'pointer'
              }}>
                {applying ? 'Submitting...' : 'Submit Application →'}
              </button>
            </form>
          </div>
        )}

        {/* Description */}
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '1.4rem',
            color: '#F8FAFC', marginBottom: '1rem'
          }}>Job Description</h2>
          <p style={{
            fontFamily: 'DM Sans', color: '#94A3B8',
            lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line'
          }}>{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div style={{
            background: '#111827', border: '1px solid #1E293B',
            borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.4rem',
              color: '#F8FAFC', marginBottom: '1rem'
            }}>Requirements</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {job.requirements.map((req, i) => (
                <li key={i} style={{
                  fontFamily: 'DM Sans', color: '#94A3B8',
                  fontSize: '0.95rem', padding: '0.5rem 0',
                  borderBottom: i < job.requirements.length - 1 ? '1px solid #1E293B' : 'none',
                  display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                  <span style={{ color: '#F59E0B', fontSize: '0.8rem' }}>▸</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div style={{
            background: '#111827', border: '1px solid #1E293B',
            borderRadius: '20px', padding: '2rem'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.4rem',
              color: '#F8FAFC', marginBottom: '1rem'
            }}>Required Skills</h2>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {job.skills.map(skill => (
                <span key={skill} style={{
                  background: 'rgba(245,158,11,0.08)',
                  color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
                  padding: '0.4rem 0.85rem', borderRadius: '6px'
                }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default JobDetail