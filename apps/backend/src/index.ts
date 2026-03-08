import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}


import uploadRoutes from './routes/upload';
import inviteRoutes from './routes/invite';
import profileRoutes from './routes/profile';

dotenv.config();

const app = express();
const server = createServer(app);

// Configure CORS for both Express and Socket.IO
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Socket.IO Setup
const io = new Server(server, {
    cors: corsOptions,
    path: '/api/socket/io',
});

io.on('connection', (socket) => {
    const relationshipId = socket.handshake.query.relationshipId;
    console.log(`Socket connected: ${socket.id} for relationship: ${relationshipId}`);

    if (relationshipId && typeof relationshipId === 'string') {
        socket.join(relationshipId);
        console.log(`Socket ${socket.id} joined room ${relationshipId}`);
    }

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });

    // Custom events will go here
});

// Configure API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/profile', profileRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`> Backend server running on http://localhost:${PORT}`);
});
