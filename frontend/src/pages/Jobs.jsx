import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs } from '../store/jobsSlice'
import JobCard from '../components/JobCard'

const jobTypes = ['', 'full-time', 'part-time', 'contract', 'remote']

const Jobs = () => {
  const dispatch = useDispatch()
  const { jobs, loading, total, pages, currentPage } = useSelector((state) => state.jobs)

  const [filters, setFilters] = useState({
    search: '', location: '', type: '', page: 1
  })

  useEffect(() => {
    // Remove empty filters
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    )
    dispatch(fetchJobs(params))
  }, [filters])

  const handleFilter = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 })
  }

  const inputStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'var(--text)', fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.9rem', padding: '0.75rem 1rem',
    borderRadius: '10px', outline: 'none', width: '100%',
    boxSizing: 'border-box'
  }

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.8rem', fontWeight: 700,
            color: 'var(--text)', marginBottom: '0.5rem'
          }}>Browse Jobs</h1>
          <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)', fontSize: '1rem' }}>
            {total} job{total !== 1 ? 's' : ''} available right now
          </p>
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '1rem', marginBottom: '2rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'DM Sans', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              Search
            </label>
            <input
              type="text" placeholder="Job title, skills..."
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'DM Sans', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              Location
            </label>
            <input
              type="text" placeholder="City, country..."
              value={filters.location}
              onChange={e => handleFilter('location', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'DM Sans', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              Type
            </label>
            <select
              value={filters.type}
              onChange={e => handleFilter('type', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'DM Sans', color: 'var(--muted)' }}>
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              No jobs found
            </p>
            <p style={{ fontFamily: 'DM Sans', color: 'var(--muted)' }}>
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
              <button key={page}
                onClick={() => setFilters({ ...filters, page })}
                style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  border: page === currentPage ? '1px solid #F59E0B' : '1px solid var(--border)',
                  background: page === currentPage ? 'rgba(245,158,11,0.1)' : 'var(--surface)',
                  color: page === currentPage ? '#F59E0B' : 'var(--muted)',
                  fontFamily: 'DM Sans', fontWeight: 600,
                  cursor: 'pointer', fontSize: '0.9rem'
                }}>
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs
