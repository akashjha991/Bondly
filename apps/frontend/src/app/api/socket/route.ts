import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export const dynamic = "force-dynamic";

export type NextApiResponseServerIo = NextApiResponse & {
    socket: any & {
        server: NetServer & {
            io: ServerIO;
        };
    };
};

export async function GET(req: Request) {
    return new Response("Socket route initialized.", { status: 200 });
}

// Next 13+ app router makes attaching socket to the same port complicated without a custom server.js
// For a production ready App Router project, it is highly recommended to run a separate custom Next server
// or an independent Node server. For the sake of this codebase, we will set up the types and provider
// as if using a separate WebSocket service, which is Vercel's standard practice currently.
