import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../utils/api'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingApplicants, setLoadingApplicants] = useState(false)

  useEffect(() => {
    fetchMyJobs()
  }, [])

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/employer/myjobs')
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplicants = async (jobId) => {
    setLoadingApplicants(true)
    setSelectedJob(jobId)
    try {
      const res = await api.get(`/applications/job/${jobId}`)
      setApplicants(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingApplicants(false)
    }
  }

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status })
      setApplicants(applicants.map(a =>
        a._id === applicationId ? { ...a, status } : a
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteJob = async (jobId) => {
    if (!confirm('Delete this job?')) return
    try {
      await api.delete(`/jobs/${jobId}`)
      setJobs(jobs.filter(j => j._id !== jobId))
      if (selectedJob === jobId) {
        setSelectedJob(null)
        setApplicants([])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const statusColors = {
    pending: { bg: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
    reviewed: { bg: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: 'rgba(59,130,246,0.3)' },
    shortlisted: { bg: 'rgba(168,85,247,0.1)', color: '#C084FC', border: 'rgba(168,85,247,0.3)' },
    rejected: { bg: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: 'rgba(239,68,68,0.3)' },
    hired: { bg: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: 'rgba(34,197,94,0.3)' },
  }

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '2.5rem',
              fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem'
            }}>Dashboard</h1>
            <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>
              {user?.company} — {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
            </p>
          </div>
          <Link to="/post-job" style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0A0F1E', fontFamily: 'DM Sans', fontWeight: 700,
            fontSize: '0.95rem', padding: '0.8rem 1.75rem',
            borderRadius: '10px', textDecoration: 'none'
          }}>+ Post New Job</Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem'
        }}>
          {[
            { label: 'Total Jobs', value: jobs.length, icon: '💼' },
            { label: 'Active Jobs', value: jobs.filter(j => j.isActive).length, icon: '✅' },
            { label: 'Total Applicants', value: jobs.reduce((sum, j) => sum + j.applicantsCount, 0), icon: '👥' },
            { label: 'Featured Jobs', value: jobs.filter(j => j.isFeatured).length, icon: '⭐' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#111827', border: '1px solid #1E293B',
              borderRadius: '14px', padding: '1.5rem'
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{
                fontFamily: 'Playfair Display, serif', fontSize: '2rem',
                fontWeight: 700, color: '#F59E0B', marginBottom: '0.25rem'
              }}>{stat.value}</div>
              <div style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.85rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>

          {/* Jobs List */}
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.4rem',
              color: '#F8FAFC', marginBottom: '1rem'
            }}>Your Jobs</h2>

            {loading ? (
              <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>Loading...</p>
            ) : jobs.length === 0 ? (
              <div style={{
                background: '#111827', border: '1px solid #1E293B',
                borderRadius: '16px', padding: '3rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💼</div>
                <p style={{ fontFamily: 'Playfair Display, serif', color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  No jobs posted yet
                </p>
                <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.9rem' }}>
                  Post your first job to start receiving applications
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {jobs.map(job => (
                  <div key={job._id} style={{
                    background: '#111827',
                    border: selectedJob === job._id ? '1px solid rgba(245,158,11,0.5)' : '1px solid #1E293B',
                    borderRadius: '14px', padding: '1.25rem',
                    cursor: 'pointer'
                  }}
                    onClick={() => fetchApplicants(job._id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{
                          fontFamily: 'Playfair Display, serif', fontSize: '1.05rem',
                          color: '#F8FAFC', marginBottom: '0.3rem'
                        }}>{job.title}</h3>
                        <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.85rem' }}>
                          {job.location} · {job.type} · {job.applicantsCount} applicants
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {job.isFeatured && (
                          <span style={{
                            background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
                            fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                            padding: '0.2rem 0.5rem', borderRadius: '4px',
                            border: '1px solid rgba(245,158,11,0.3)'
                          }}>⭐</span>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); deleteJob(job._id) }}
                          style={{
                            background: 'transparent', border: '1px solid #1E293B',
                            color: '#64748B', fontFamily: 'DM Sans', fontSize: '0.8rem',
                            padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer'
                          }}
                          onMouseEnter={e => { e.target.style.borderColor = '#EF4444'; e.target.style.color = '#EF4444' }}
                          onMouseLeave={e => { e.target.style.borderColor = '#1E293B'; e.target.style.color = '#64748B' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applicants Panel */}
          {selectedJob && (
            <div>
              <h2 style={{
                fontFamily: 'Playfair Display, serif', fontSize: '1.4rem',
                color: '#F8FAFC', marginBottom: '1rem'
              }}>Applicants
                <span style={{ fontFamily: 'DM Sans', fontSize: '0.9rem', color: '#94A3B8', fontWeight: 400, marginLeft: '0.75rem' }}>
                  {applicants.length} total
                </span>
              </h2>

              {loadingApplicants ? (
                <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>Loading applicants...</p>
              ) : applicants.length === 0 ? (
                <div style={{
                  background: '#111827', border: '1px solid #1E293B',
                  borderRadius: '16px', padding: '2.5rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👥</div>
                  <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>No applications yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {applicants.map(app => {
                    const s = statusColors[app.status] || statusColors.pending
                    return (
                      <div key={app._id} style={{
                        background: '#111827', border: '1px solid #1E293B',
                        borderRadius: '14px', padding: '1.25rem'
                      }}>
                        {/* Applicant Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <div>
                            <p style={{ fontFamily: 'DM Sans', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.2rem' }}>
                              {app.applicant?.name}
                            </p>
                            <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.85rem' }}>
                              {app.applicant?.email}
                            </p>
                          </div>
                          <span style={{
                            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                            fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                            padding: '0.25rem 0.6rem', borderRadius: '4px',
                            textTransform: 'uppercase', letterSpacing: '0.06em'
                          }}>{app.status}</span>
                        </div>

                        {/* Skills */}
                        {app.applicant?.skills?.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                            {app.applicant.skills.map(skill => (
                              <span key={skill} style={{
                                background: '#1A2235', color: '#64748B',
                                fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                                padding: '0.2rem 0.5rem', borderRadius: '4px',
                                border: '1px solid #1E293B'
                              }}>{skill}</span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>

                          {/* View CV */}
                          {app.resume && (
                            <a href={app.resume} target="_blank" rel="noreferrer" style={{
                              background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
                              border: '1px solid rgba(245,158,11,0.2)',
                              fontFamily: 'DM Sans', fontSize: '0.8rem', fontWeight: 500,
                              padding: '0.3rem 0.75rem', borderRadius: '6px',
                              textDecoration: 'none'
                            }}>📄 View CV</a>
                          )}

                          {/* View Profile */}
                          <a href={`/profile/${app.applicant?._id}`} target="_blank" rel="noreferrer" style={{
                            background: 'rgba(96,165,250,0.1)', color: '#60A5FA',
                            border: '1px solid rgba(96,165,250,0.2)',
                            fontFamily: 'DM Sans', fontSize: '0.8rem', fontWeight: 500,
                            padding: '0.3rem 0.75rem', borderRadius: '6px',
                            textDecoration: 'none'
                          }}>👤 View Profile</a>

                          {/* Status Selector */}
                          <select
                            value={app.status}
                            onChange={e => updateStatus(app._id, e.target.value)}
                            style={{
                              background: '#1A2235', border: '1px solid #1E293B',
                              color: '#94A3B8', fontFamily: 'DM Sans', fontSize: '0.8rem',
                              padding: '0.3rem 0.6rem', borderRadius: '6px',
                              cursor: 'pointer', outline: 'none'
                            }}>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard