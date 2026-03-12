import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const PublicProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/auth/profile/${id}`)
        setProfile(res.data)
      } catch (err) {
        setError('Profile not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>Loading profile...</p>
    </div>
  )

  if (error || !profile) return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: '#94A3B8' }}>Profile not found</p>
    </div>
  )

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', color: '#94A3B8',
          fontFamily: 'DM Sans', fontSize: '0.9rem', cursor: 'pointer',
          marginBottom: '2rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>← Back</button>

        {/* Profile Header */}
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '20px', padding: '2.5rem', marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: '#0A0F1E',
              fontFamily: 'DM Sans', flexShrink: 0, overflow: 'hidden'
            }}>
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : profile.name?.charAt(0).toUpperCase()
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'Playfair Display, serif', fontSize: '2rem',
                fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem'
              }}>{profile.name}</h1>
              <p style={{ fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                ✉️ {profile.email}
              </p>
              <span style={{
                background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
                border: '1px solid rgba(245,158,11,0.3)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                padding: '0.2rem 0.6rem', borderRadius: '4px',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>Jobseeker</span>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div style={{
              marginTop: '1.5rem', paddingTop: '1.5rem',
              borderTop: '1px solid #1E293B'
            }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif', fontSize: '1.1rem',
                color: '#F8FAFC', marginBottom: '0.75rem'
              }}>About</h2>
              <p style={{
                fontFamily: 'DM Sans', color: '#94A3B8',
                lineHeight: 1.8, fontSize: '0.95rem'
              }}>{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div style={{
            background: '#111827', border: '1px solid #1E293B',
            borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.3rem',
              color: '#F8FAFC', marginBottom: '1rem'
            }}>Skills</h2>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {profile.skills.map(skill => (
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

        {/* Resume */}
        {profile.resume && (
          <div style={{
            background: '#111827', border: '1px solid #1E293B',
            borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.3rem',
              color: '#F8FAFC', marginBottom: '1rem'
            }}>Resume / CV</h2>
            <a href={profile.resume} target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
              border: '1px solid rgba(245,158,11,0.3)',
              fontFamily: 'DM Sans', fontSize: '0.9rem', fontWeight: 600,
              padding: '0.6rem 1.25rem', borderRadius: '8px',
              textDecoration: 'none'
            }}>📄 Download CV</a>
          </div>
        )}

        {/* Member Since */}
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '20px', padding: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>🗓️</span>
          <span style={{ fontFamily: 'DM Sans', color: '#64748B', fontSize: '0.9rem' }}>
            Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </span>
        </div>

      </div>
    </div>
  )
}

export default PublicProfile