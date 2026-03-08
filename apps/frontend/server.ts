import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev: true }); // Always force dev for local testing
const handle = app.getRequestHandler();

// The port Next.js runs on locally
const PORT = parseInt(process.env.PORT || "3000", 10);

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        path: "/api/socket/io",
        addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
        const relationshipId = socket.handshake.query.relationshipId;
        console.log(`Socket connected: ${socket.id} for relationship: ${relationshipId}`);

        if (relationshipId && typeof relationshipId === "string") {
            socket.join(relationshipId);
            console.log(`Socket ${socket.id} joined room ${relationshipId}`);
        }

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });

        // Add any other custom event listeners you need here
    });

    server.listen(PORT, (err?: any) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
