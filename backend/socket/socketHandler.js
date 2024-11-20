// import Room from '../models/Room.js';

// export const handleSocket = (io, socket) => {





//   socket.on('join_room', async ({ roomId, username }) => {
//     socket.join(roomId);
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       if (room.participants.includes(username)) {
//         io.to(roomId).emit('room_update', room);
//       } else {
//         socket.to(roomId).emit('join_request', { username });
//       }
//     }
//   });

//   socket.on('join_request', async ({ roomId, username }) => {
//     const room = await Room.findOne({ roomId });
//     if (room && room.participants.length < 7) {
//       socket.to(roomId).emit('join_request', { username });
//     } else {
//       socket.emit('room_full');
//     }
//   });

//   socket.on('accept_request', async ({ roomId, username }) => {
//     const room = await Room.findOne({ roomId });
//     if (room && !room.participants.includes(username)) {
//       room.participants.push(username);
//       await room.save();
//       io.to(roomId).emit('room_update', room);
//       io.to(roomId).emit('request_accepted', { username });
//     }
//   });

//   socket.on('reject_request', async ({ roomId, username }) => {
//     socket.to(roomId).emit('request_rejected', { username });
//   });

//   socket.on('leave_room', async ({ roomId, username }) => {
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       room.participants = room.participants.filter(u => u !== username);
//       await room.save();
//       socket.leave(roomId);
//       io.to(roomId).emit('room_update', room);
//     }
//   });

//   socket.on('video_control', ({ roomId, action, time }) => {
//     socket.to(roomId).emit('video_control', { action, time });
//   });

//   socket.on('chat_message', ({ roomId, message, username }) => {
//     io.to(roomId).emit('chat_message', { message, username });
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   socket.on('join_room', async ({ roomId, userId }) => {
//     socket.join(roomId);
//     const room = await Room.findOne({ roomId }).populate('participants', 'username');
//     if (room) {
//       io.to(roomId).emit('room_update', room);
//     }
//   });

//   socket.on('leave_room', async ({ roomId, userId }) => {
//     socket.leave(roomId);
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       room.participants = room.participants.filter(id => id.toString() !== userId);
//       await room.save();
//       io.to(roomId).emit('room_update', room);
//     }
//   });

//   socket.on('video_control', async ({ roomId, action, time }) => {
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       room.isPlaying = action === 'play';
//       room.currentTime = time;
//       await room.save();
//       socket.to(roomId).emit('video_control', { action, time });
//     }
//   });

//   socket.on('chat_message', ({ roomId, message, username }) => {
//     io.to(roomId).emit('chat_message', { message, username });
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
//   socket.on('join_request', async ({ roomId, username }) => {
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       if (room.participants.includes(username)) {
//         socket.join(roomId);
//         io.to(roomId).emit('room_update', room);
//       } else if (room.participants.length < 7) {
//         room.pendingRequests.push(username);
//         await room.save();
//         io.to(roomId).emit('join_request', { username });
//       } else {
//         socket.emit('room_full');
//       }
//     }
//   });

//   socket.on('accept_request', async ({ roomId, username }) => {
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       room.pendingRequests = room.pendingRequests.filter(u => u !== username);
//       room.participants.push(username);
//       await room.save();
//       io.to(roomId).emit('room_update', room);
//     }
//   });

//   socket.on('reject_request', async ({ roomId, username }) => {
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       room.pendingRequests = room.pendingRequests.filter(u => u !== username);
//       await room.save();
//       socket.to(roomId).emit('request_rejected', { username });
//     }
//   });

//   socket.on('leave_room', async ({ roomId, username }) => {
//     const room = await Room.findOne({ roomId });
//     if (room) {
//       room.participants = room.participants.filter(u => u !== username);
//       await room.save();
//       socket.leave(roomId);
//       io.to(roomId).emit('room_update', room);
//     }
//   });
// };




import Room from '../models/Room.js';

export const handleSocket = (io, socket) => {
  socket.on('join_room', async ({ roomId, username }) => {
    const room = await Room.findOne({ roomId });
    if (room) {
      socket.join(roomId);
      if (!room.participants.includes(username)) {
        room.participants.push(username);
        await room.save();
      }
      io.to(roomId).emit('room_update', room);
    } else {
      socket.emit('room_not_found');
    }
  });

  socket.on('join_request', async ({ roomId, username }) => {
    const room = await Room.findOne({ roomId });
    if (room) {
      if (room.participants.length < 7) {
        socket.to(roomId).emit('join_request', { username });
      } else {
        socket.emit('room_full');
      }
    } else {
      socket.emit('room_not_found');
    }
  });

  socket.on('accept_request', async ({ roomId, username }) => {
    const room = await Room.findOne({ roomId });
    if (room && !room.participants.includes(username)) {
      room.participants.push(username);
      await room.save();
      io.to(roomId).emit('room_update', room);
      io.to(roomId).emit('request_accepted', { username });
    }
  });

  socket.on('reject_request', async ({ roomId, username }) => {
    socket.to(roomId).emit('request_rejected', { username });
  });

  socket.on('leave_room', async ({ roomId, username }) => {
    const room = await Room.findOne({ roomId });
    if (room) {
      room.participants = room.participants.filter(u => u !== username);
      await room.save();
      socket.leave(roomId);
      io.to(roomId).emit('room_update', room);
    }
  });

  socket.on('video_control', ({ roomId, action, time }) => {
    socket.to(roomId).emit('video_control', { action, time });
  });

  socket.on('video_chunk', ({ roomId, chunk, metadata }) => {
    socket.to(roomId).emit('video_chunk', { chunk, metadata });
  });

  socket.on('chat_message', ({ roomId, message, username }) => {
    io.to(roomId).emit('chat_message', { message, username });
  });


  socket.on('join_video_room', ({ roomId, username }) => {
    socket.join(roomId)
    socket.to(roomId).emit('user_joined', { userId: socket.id, username })
  })
  
  socket.on('sending_signal', ({ userId, signal }) => {
    socket.to(userId).emit('receiving_signal', { signal, userId: socket.id })
  })
  
  socket.on('returning_signal', ({ signal, userId }) => {
    socket.to(userId).emit('receiving_returned_signal', { signal, userId: socket.id })
  })
  socket.on('room_update', (roomData) => {
    io.to(roomId).emit('room_update', {
      participants: roomData.participants,
      host: roomData.host,
      startTime: roomData.startTime,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
};



