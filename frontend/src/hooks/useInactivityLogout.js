import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'

const INACTIVITY_LIMIT = 3 * 60 * 1000 // 3 minutes in milliseconds

const useInactivityLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const timerRef = useRef(null)
  const warningRef = useRef(null)

  const resetTimer = () => {
    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)

    // Only run if user is logged in
    if (!user) return

    // Warning at 2 minutes 30 seconds
    warningRef.current = setTimeout(() => {
      const toast = document.getElementById('inactivity-warning')
      if (toast) {
        toast.style.display = 'flex'
        toast.style.opacity = '1'
      }
    }, INACTIVITY_LIMIT - 30000)

    // Logout at 3 minutes
    timerRef.current = setTimeout(() => {
      dispatch(logout())
      navigate('/login')
      // Show logged out message briefly
      const toast = document.getElementById('inactivity-warning')
      if (toast) toast.style.display = 'none'
    }, INACTIVITY_LIMIT)
  }

  useEffect(() => {
    if (!user) return

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']

    const handleActivity = () => {
      // Hide warning if showing
      const toast = document.getElementById('inactivity-warning')
      if (toast) {
        toast.style.opacity = '0'
        setTimeout(() => { toast.style.display = 'none' }, 300)
      }
      resetTimer()
    }

    // Start timer
    resetTimer()

    // Listen for activity
    events.forEach(event => window.addEventListener(event, handleActivity))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
      events.forEach(event => window.removeEventListener(event, handleActivity))
    }
  }, [user])
}

export default useInactivityLogout