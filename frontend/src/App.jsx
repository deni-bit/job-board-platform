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

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
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