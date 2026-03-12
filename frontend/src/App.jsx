import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PostJob from './pages/PostJob'
import Applications from './pages/Applications'
import AdminPanel from './pages/AdminPanel'
import PublicProfile from './pages/PublicProfile'
import CompanyProfile from './pages/CompanyProfile'
import CompanySettings from './pages/CompanySettings'
import useInactivityLogout from './hooks/useInactivityLogout'

function App() {
  useInactivityLogout()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Inactivity Warning Toast */}
      <div id="inactivity-warning" style={{
        display: 'none',
        opacity: 0,
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: '#111827',
        border: '1px solid rgba(245,158,11,0.4)',
        borderRadius: '14px',
        padding: '1rem 1.5rem',
        zIndex: 9999,
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'opacity 0.3s ease',
        maxWidth: '320px'
      }}>
        <span style={{ fontSize: '1.3rem' }}>⚠️</span>
        <div>
          <p style={{
            fontFamily: 'DM Sans', fontWeight: 600,
            color: '#F59E0B', fontSize: '0.9rem', marginBottom: '0.2rem'
          }}>Still there?</p>
          <p style={{
            fontFamily: 'DM Sans', color: '#94A3B8', fontSize: '0.8rem'
          }}>You'll be logged out in 30 seconds due to inactivity.</p>
        </div>
      </div>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
        <Route path="/company/:id" element={<CompanyProfile />} />

        {/* Employer routes */}
        <Route path="/dashboard" element={
          <PrivateRoute roles={['employer']}>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/post-job" element={
          <PrivateRoute roles={['employer']}>
            <PostJob />
          </PrivateRoute>
        } />
        <Route path="/company-settings" element={
          <PrivateRoute roles={['employer']}>
            <CompanySettings />
          </PrivateRoute>
        } />

        {/* Jobseeker routes */}
        <Route path="/applications" element={
          <PrivateRoute roles={['jobseeker']}>
            <Applications />
          </PrivateRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <PrivateRoute roles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  )
}

export default App