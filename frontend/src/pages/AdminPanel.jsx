import { useEffect, useState } from 'react'
import api from '../utils/api'

const AdminPanel = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/jobs')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data.users)
      setJobs(jobsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/admin/users/${id}`)
    setUsers(users.filter(u => u._id !== id))
  }

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return
    await api.delete(`/admin/jobs/${id}`)
    setJobs(jobs.filter(j => j._id !== id))
  }

  const toggleFeatured = async (id) => {
    const res = await api.put(`/admin/jobs/${id}/feature`)
    setJobs(jobs.map(j => j._id === id ? res.data.job : j))
  }

  const tabStyle = (tab) => ({
    padding: '0.6rem 1.25rem',
    borderRadius: '8px',
    border: activeTab === tab ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
    background: activeTab === tab ? 'rgba(245,158,11,0.1)' : 'transparent',
    color: activeTab === tab ? '#F59E0B' : '#94A3B8',
    fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.9rem',
    cursor: 'pointer'
  })

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>Loading admin panel...</p>
    </div>
  )

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '2.5rem',
            fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem'
          }}>Admin Panel</h1>
          <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>
            Full platform control
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {['overview', 'users', 'jobs'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
              {tab === 'overview' ? '📊 Overview' : tab === 'users' ? '👥 Users' : '💼 Jobs'}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#60A5FA' },
              { label: 'Job Seekers', value: stats.jobseekers, icon: '🔍', color: '#C084FC' },
              { label: 'Employers', value: stats.employers, icon: '🏢', color: '#F59E0B' },
              { label: 'Total Jobs', value: stats.totalJobs, icon: '💼', color: '#4ADE80' },
              { label: 'Applications', value: stats.totalApplications, icon: '📋', color: '#FCD34D' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#111827', border: '1px solid #1E293B',
                borderRadius: '16px', padding: '1.75rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
                <div style={{
                  fontFamily: 'Playfair Display, serif', fontSize: '2.2rem',
                  fontWeight: 700, color: stat.color, marginBottom: '0.25rem'
                }}>{stat.value}</div>
                <div style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.9rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', marginBottom: '1.25rem' }}>
              {users.length} total users
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map(user => (
                <div key={user._id} style={{
                  background: '#111827', border: '1px solid #1E293B',
                  borderRadius: '14px', padding: '1.25rem',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                }}>
                  <div>
                    <p style={{ fontFamily: 'DM Sans', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.2rem' }}>
                      {user.name}
                    </p>
                    <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.85rem' }}>
                      {user.email} {user.company && `· ${user.company}`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                      background: user.role === 'admin' ? 'rgba(239,68,68,0.1)' : user.role === 'employer' ? 'rgba(245,158,11,0.1)' : 'rgba(168,85,247,0.1)',
                      color: user.role === 'admin' ? '#FCA5A5' : user.role === 'employer' ? '#F59E0B' : '#C084FC',
                      border: `1px solid ${user.role === 'admin' ? 'rgba(239,68,68,0.3)' : user.role === 'employer' ? 'rgba(245,158,11,0.3)' : 'rgba(168,85,247,0.3)'}`,
                      padding: '0.25rem 0.6rem', borderRadius: '4px',
                      textTransform: 'uppercase', letterSpacing: '0.06em'
                    }}>{user.role}</span>
                    <button onClick={() => deleteUser(user._id)} style={{
                      background: 'transparent', border: '1px solid #1E293B',
                      color: '#64748B', fontFamily: 'DM Sans', fontSize: '0.8rem',
                      padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer'
                    }}
                      onMouseEnter={e => { e.target.style.borderColor = '#EF4444'; e.target.style.color = '#EF4444' }}
                      onMouseLeave={e => { e.target.style.borderColor = '#1E293B'; e.target.style.color = '#64748B' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs */}
        {activeTab === 'jobs' && (
          <div>
            <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', marginBottom: '1.25rem' }}>
              {jobs.length} total jobs
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.map(job => (
                <div key={job._id} style={{
                  background: '#111827', border: '1px solid #1E293B',
                  borderRadius: '14px', padding: '1.25rem',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                }}>
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: '#F8FAFC', marginBottom: '0.3rem' }}>
                      {job.title}
                    </h3>
                    <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.85rem' }}>
                      {job.company} · {job.location} · {job.applicantsCount} applicants
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={() => toggleFeatured(job._id)} style={{
                      background: job.isFeatured ? 'rgba(245,158,11,0.1)' : 'transparent',
                      border: job.isFeatured ? '1px solid rgba(245,158,11,0.4)' : '1px solid #1E293B',
                      color: job.isFeatured ? '#F59E0B' : '#64748B',
                      fontFamily: 'DM Sans', fontSize: '0.8rem',
                      padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer'
                    }}>
                      {job.isFeatured ? '⭐ Featured' : 'Feature'}
                    </button>
                    <button onClick={() => deleteJob(job._id)} style={{
                      background: 'transparent', border: '1px solid #1E293B',
                      color: '#64748B', fontFamily: 'DM Sans', fontSize: '0.8rem',
                      padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer'
                    }}
                      onMouseEnter={e => { e.target.style.borderColor = '#EF4444'; e.target.style.color = '#EF4444' }}
                      onMouseLeave={e => { e.target.style.borderColor = '#1E293B'; e.target.style.color = '#64748B' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel