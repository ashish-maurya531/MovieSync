import Room from '../models/Room.js';
import { v4 as uuidv4 } from 'uuid';


// export const createRoom = async (req, res) => {
//   try {
//     const { username } = req.body;
//     const roomId = uuidv4();
//     const room = await Room.create({
//       roomId,
//       name: `${username}'s Room`,
//       host: username,
//       participants: [username],
//     });
//     res.status(201).json(room);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createRoom = async (req, res) => {
  try {
    const { username } = req.body;
    const roomId = uuidv4();
    const startTime = Date.now();
    const room = await Room.create({
      roomId,
      name: `${username}'s Room`,
      host: username,
      participants: [{ username, isHost: true }],
      startTime,
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomInfo = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { username } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (!room.participants.includes(username)) {
      room.participants.push(username);
      await room.save();
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    room.participants = room.participants.filter(
      (participant) => participant.toString() !== req.user._id.toString()
    );
    if (room.participants.length === 0) {
      await Room.deleteOne({ _id: room._id });
      return res.json({ message: 'Room deleted' });
    }
    if (room.host.toString() === req.user._id.toString()) {
      room.host = room.participants[0];
    }
    await room.save();
    res.json({ message: 'Left room successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoomState = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { currentVideo, isPlaying, currentTime } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (currentVideo !== undefined) room.currentVideo = currentVideo;
    if (isPlaying !== undefined) room.isPlaying = isPlaying;
    if (currentTime !== undefined) room.currentTime = currentTime;
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};