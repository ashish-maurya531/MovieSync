import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import roomRoutes from './routes/roomRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { handleSocket } from './socket/socketHandler.js'
import connectDB from './config/db.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"]
  }
})

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/rooms', roomRoutes)
app.use('/api/users', userRoutes)

io.on('connection', (socket) => handleSocket(io, socket))

const PORT = 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))



app.listen("4000", () => {
    console.log(`Server running on port4000`)
})

app.get('/',(req,res)=>{
    res.send('Hello World')
})
