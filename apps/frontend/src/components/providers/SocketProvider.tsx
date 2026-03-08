"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
    relationshipId: string | null;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    relationshipId: null,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({
    children,
    relationshipId,
}: {
    children: React.ReactNode;
    relationshipId: string | null;
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!relationshipId) return;

        // Connect to the external WebSocket server (or standard path if using custom Next server)
        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
            path: "/api/socket/io",
            addTrailingSlash: false,
            query: { relationshipId },
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
            // Join a specific room based on relationship ID
            socketInstance.emit("join-room", relationshipId);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [relationshipId]);

    return (
        <SocketContext.Provider value={{ socket, isConnected, relationshipId }}>
            {children}
        </SocketContext.Provider>
    );
};
