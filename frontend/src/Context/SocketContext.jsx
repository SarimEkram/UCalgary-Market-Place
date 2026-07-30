import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        // Get token from cookie by making a request, or pass it manually
        // For simplicity, we store the token in localStorage on login
        const token = localStorage.getItem("socketToken");
        if (!token) return;

        const s = io("http://localhost:8080", {
            auth: { token },
        });

        s.on("connect", () => {
            console.log("Socket connected:", s.id);
        });

        s.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}