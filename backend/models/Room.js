import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  host: { type: String, required: true },
  participants: [{ type: String }],
  pendingRequests: [{ type: String }],
  currentVideo: { type: String, default: '' },
  isPlaying: { type: Boolean, default: false },
  currentTime: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: '3h' }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;