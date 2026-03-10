const Notification = require('../models/Notification');

// Store online users: { userId: socketId }
const onlineUsers = {};

const initSocket = (io) => {

  io.on('connection', (socket) => {
    console.log('🔌 New socket connection:', socket.id);

    // When user logs in — save their socket id
    socket.on('userOnline', (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`👤 User ${userId} is online`);
    });

    // When user disconnects — remove them
    socket.on('disconnect', () => {
      for (const [userId, socketId] of Object.entries(onlineUsers)) {
        if (socketId === socket.id) {
          delete onlineUsers[userId];
          console.log(`👤 User ${userId} went offline`);
          break;
        }
      }
    });
  });

};

// Send notification to a specific user
const sendNotification = async (io, { recipientId, type, message, link }) => {
  try {
    // Save notification to database
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      message,
      link
    });

    // If user is online — send real-time notification instantly
    const socketId = onlineUsers[recipientId.toString()];
    if (socketId) {
      io.to(socketId).emit('newNotification', notification);
      console.log(`🔔 Real-time notification sent to ${recipientId}`);
    }

    return notification;
  } catch (error) {
    console.log('❌ Notification error:', error.message);
  }
};

module.exports = { initSocket, sendNotification, onlineUsers };