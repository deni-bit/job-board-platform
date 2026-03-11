import { Link } from 'react-router-dom'

const typeColors = {
  'full-time': { bg: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: 'rgba(34,197,94,0.3)' },
  'part-time': { bg: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: 'rgba(59,130,246,0.3)' },
  'contract': { bg: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
  'remote': { bg: 'rgba(168,85,247,0.1)', color: '#C084FC', border: 'rgba(168,85,247,0.3)' },
}

const JobCard = ({ job }) => {
  const typeStyle = typeColors[job.type] || typeColors['full-time']
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#111827',
        border: job.isFeatured ? '1px solid rgba(245,158,11,0.4)' : '1px solid #1E293B',
        borderRadius: '16px',
        padding: '1.75rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = job.isFeatured ? 'rgba(245,158,11,0.7)' : 'rgba(245,158,11,0.3)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = job.isFeatured ? 'rgba(245,158,11,0.4)' : '#1E293B'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}>

        {/* Featured badge */}
        {job.isFeatured && (
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0A0F1E',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem', fontWeight: 700,
            padding: '0.2rem 0.6rem', borderRadius: '4px',
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>⭐ Featured</div>
        )}

        {/* Company + Title */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
            color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 500
          }}>
            {job.company}
          </div>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.2rem', fontWeight: 600,
            color: '#F8FAFC', lineHeight: 1.3
          }}>{job.title}</h3>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span style={{
            background: typeStyle.bg, color: typeStyle.color,
            border: `1px solid ${typeStyle.border}`,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem', fontWeight: 500,
            padding: '0.25rem 0.65rem', borderRadius: '4px',
            textTransform: 'uppercase', letterSpacing: '0.06em'
          }}>{job.type}</span>

          <span style={{
            background: 'rgba(148,163,184,0.08)', color: '#94A3B8',
            border: '1px solid #1E293B',
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
            padding: '0.25rem 0.65rem', borderRadius: '4px'
          }}>📍 {job.location}</span>

          {job.salary?.min > 0 && (
            <span style={{
              background: 'rgba(34,197,94,0.08)', color: '#4ADE80',
              border: '1px solid rgba(34,197,94,0.2)',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
              padding: '0.25rem 0.65rem', borderRadius: '4px'
            }}>
              ${job.salary.min.toLocaleString()} — ${job.salary.max.toLocaleString()}
            </span>
          )}
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {job.skills.slice(0, 4).map(skill => (
              <span key={skill} style={{
                background: '#1A2235', color: '#64748B',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.7rem', padding: '0.2rem 0.5rem',
                borderRadius: '4px', border: '1px solid #1E293B'
              }}>{skill}</span>
            ))}
            {job.skills.length > 4 && (
              <span style={{
                color: '#475569', fontFamily: 'DM Sans', fontSize: '0.75rem',
                padding: '0.2rem 0.4rem'
              }}>+{job.skills.length - 4} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid #1E293B', paddingTop: '1rem'
        }}>
          <span style={{ fontFamily: 'DM Sans', color: '#475569', fontSize: '0.8rem' }}>
            {timeAgo(job.createdAt)}
          </span>
          <span style={{ fontFamily: 'DM Sans', color: '#475569', fontSize: '0.8rem' }}>
            {job.applicantsCount} applicant{job.applicantsCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default JobCard
