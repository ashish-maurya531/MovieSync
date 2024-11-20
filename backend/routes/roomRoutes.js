import express from 'express';
import { createRoom, getRoomInfo, joinRoom, leaveRoom, updateRoomState } from '../controllers/roomControllers.js';

const router = express.Router();

router.post('/create', createRoom);
router.get('/:roomId', getRoomInfo);
router.post('/join/:roomId', joinRoom);
router.post('/leave/:roomId', leaveRoom);
router.put('/update/:roomId', updateRoomState);

export default router;