import { Server } from "socket.io";
import { verifyToken } from "./utils/token.js";

const userSockets = new Map();

export function setupSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("No token"));
            }
            const decoded = verifyToken(token);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        userSockets.set(socket.userId, socket.id);

        socket.on("disconnect", () => {
            userSockets.delete(socket.userId);
        });
    });

    return io;
}

export function getSocketId(userId) {
    return userSockets.get(userId) || null;
}

export let io = null;

export function setIo(instance) {
    io = instance;
}