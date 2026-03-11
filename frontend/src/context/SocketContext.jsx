import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io('http://localhost:5000')

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    // Tell server this user is online
    if (user && socketRef.current) {
      socketRef.current.emit('userOnline', user.id)
    }
  }, [user])

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)