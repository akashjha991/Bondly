"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const upload_1 = __importDefault(require("./routes/upload"));
const invite_1 = __importDefault(require("./routes/invite"));
const profile_1 = __importDefault(require("./routes/profile"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Configure CORS for both Express and Socket.IO
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Socket.IO Setup
const io = new socket_io_1.Server(server, {
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
app.use('/api/upload', upload_1.default);
app.use('/api/invite', invite_1.default);
app.use('/api/profile', profile_1.default);
// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`> Backend server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map