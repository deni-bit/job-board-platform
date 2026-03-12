import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const CompanySettings = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    company: '',
    companyLogo: '',
    companyWebsite: '',
    companySize: '',
    companyIndustry: '',
    companyDescription: '',
    companyLocation: '',
    companyFoundedYear: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me')
        const u = res.data
        setForm({
          company: u.company || '',
          companyLogo: u.companyLogo || '',
          companyWebsite: u.companyWebsite || '',
          companySize: u.companySize || '',
          companyIndustry: u.companyIndustry || '',
          companyDescription: u.companyDescription || '',
          companyLocation: u.companyLocation || '',
          companyFoundedYear: u.companyFoundedYear || '',
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await api.put('/auth/company', form)
      setSuccess('Company profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update company profile')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#1A2235', border: '1px solid #1E293B',
    color: '#F8FAFC', fontFamily: 'DM Sans', fontSize: '0.95rem',
    padding: '0.85rem 1rem', borderRadius: '10px', outline: 'none',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontFamily: 'DM Sans', fontWeight: 500,
    color: '#CBD5E1', fontSize: '0.875rem', marginBottom: '0.5rem'
  }

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '2.2rem',
              fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem'
            }}>Company Profile</h1>
            <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>
              How your company appears to jobseekers
            </p>
          </div>
          <button onClick={() => navigate(`/company/${user?.id}`)} style={{
            background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
            border: '1px solid rgba(245,158,11,0.3)',
            fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.9rem',
            padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer'
          }}>👁 Preview Page</button>
        </div>

        {/* Form */}
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '20px', padding: '2.5rem'
        }}>

          {success && (
            <div style={{
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#6EE7B7', fontFamily: 'DM Sans', fontSize: '0.9rem',
              padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem'
            }}>✓ {success}</div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', fontFamily: 'DM Sans', fontSize: '0.9rem',
              padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Company Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Company Name</label>
              <input
                type="text" value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. TechCorp Ltd"
                style={inputStyle}
              />
            </div>

            {/* Industry */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Industry</label>
              <input
                type="text" value={form.companyIndustry}
                onChange={e => setForm({ ...form, companyIndustry: e.target.value })}
                placeholder="e.g. Information Technology, Finance, Healthcare"
                style={inputStyle}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Company Location</label>
              <input
                type="text" value={form.companyLocation}
                onChange={e => setForm({ ...form, companyLocation: e.target.value })}
                placeholder="e.g. Dar es Salaam, Tanzania"
                style={inputStyle}
              />
            </div>

            {/* Size and Founded Year — side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Company Size</label>
                <select
                  value={form.companySize}
                  onChange={e => setForm({ ...form, companySize: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Founded Year</label>
                <input
                  type="number" value={form.companyFoundedYear}
                  onChange={e => setForm({ ...form, companyFoundedYear: e.target.value })}
                  placeholder="e.g. 2015"
                  min="1900" max={new Date().getFullYear()}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Website */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Company Website</label>
              <input
                type="url" value={form.companyWebsite}
                onChange={e => setForm({ ...form, companyWebsite: e.target.value })}
                placeholder="https://yourcompany.com"
                style={inputStyle}
              />
            </div>

            {/* Logo URL */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Company Logo URL</label>
              <input
                type="url" value={form.companyLogo}
                onChange={e => setForm({ ...form, companyLogo: e.target.value })}
                placeholder="https://yourcompany.com/logo.png"
                style={inputStyle}
              />
              {form.companyLogo && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={form.companyLogo} alt="Logo preview"
                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #1E293B' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  <span style={{ fontFamily: 'DM Sans', color: '#64748B', fontSize: '0.8rem' }}>Logo preview</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Company Description</label>
              <textarea
                value={form.companyDescription}
                onChange={e => setForm({ ...form, companyDescription: e.target.value })}
                rows={5}
                placeholder="Tell jobseekers about your company, culture, and what makes you unique..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              background: loading ? '#92400E' : 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#0A0F1E', fontFamily: 'DM Sans', fontWeight: 700,
              fontSize: '1rem', padding: '0.85rem 2.5rem',
              borderRadius: '10px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', width: '100%'
            }}>
              {loading ? 'Saving...' : 'Save Company Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompanySettings