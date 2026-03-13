import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../utils/api'

const PostJob = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    type: 'full-time', requirements: '', skills: '',
    salaryMin: '', salaryMax: '', currency: 'USD', deadline: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/jobs', {
        title: form.title,
        description: form.description,
        location: form.location,
        type: form.type,
        requirements: form.requirements.split('\n').filter(r => r.trim()),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        salary: {
          min: Number(form.salaryMin) || 0,
          max: Number(form.salaryMax) || 0,
          currency: form.currency
        },
        deadline: form.deadline || undefined
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
    padding: '0.8rem 1rem', borderRadius: '10px', outline: 'none',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500, color: '#CBD5E1',
    fontSize: '0.875rem', marginBottom: '0.5rem'
  }

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '2.5rem',
            fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem'
          }}>Post a Job</h1>
          <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>
            Posting as <span style={{ color: '#F59E0B' }}>{user?.company}</span>
          </p>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '2.5rem'
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', fontFamily: 'DM Sans', fontSize: '0.9rem',
              padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                required placeholder="e.g. Senior React Developer"
                style={inputStyle} />
            </div>

            {/* Location + Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Location *</label>
                <input name="location" value={form.location} onChange={handleChange}
                  required placeholder="e.g. Dar es Salaam, Tanzania"
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Job Type *</label>
                <select name="type" value={form.type} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Salary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Min Salary</label>
                <input name="salaryMin" value={form.salaryMin} onChange={handleChange}
                  type="number" placeholder="2000"
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Max Salary</label>
                <input name="salaryMax" value={form.salaryMax} onChange={handleChange}
                  type="number" placeholder="5000"
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="USD">USD</option>
                  <option value="TZS">TZS</option>
                  <option value="KES">KES</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Job Description *</label>
              <textarea name="description" value={form.description}
                onChange={handleChange} required rows={6}
                placeholder="Describe the role, responsibilities, and what success looks like..."
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Requirements
                <span style={{ color: '#64748B', fontWeight: 400, marginLeft: '0.5rem' }}>
                  (one per line)
                </span>
              </label>
              <textarea name="requirements" value={form.requirements}
                onChange={handleChange} rows={4}
                placeholder={"3+ years React experience\nStrong JavaScript skills\nExperience with Node.js"}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Required Skills
                <span style={{ color: '#64748B', fontWeight: 400, marginLeft: '0.5rem' }}>
                  (comma separated)
                </span>
              </label>
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="React, Node.js, MongoDB, TypeScript"
                style={inputStyle} />
            </div>

            {/* Deadline */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Application Deadline
                <span style={{ color: '#64748B', fontWeight: 400, marginLeft: '0.5rem' }}>
                  (optional)
                </span>
              </label>
              <input name="deadline" value={form.deadline} onChange={handleChange}
                type="date"
                style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={loading} style={{
                background: loading ? '#92400E' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'var(--navy)', fontFamily: 'DM Sans', fontWeight: 700,
                fontSize: '1rem', padding: '0.9rem 2.5rem',
                borderRadius: '10px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
                {loading ? 'Posting...' : 'Post Job →'}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', fontFamily: 'DM Sans', fontWeight: 500,
                fontSize: '1rem', padding: '0.9rem 1.5rem',
                borderRadius: '10px', cursor: 'pointer'
              }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostJob
