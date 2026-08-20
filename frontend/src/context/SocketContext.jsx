import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components -- context + accessor hook are deliberately co-located
export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("socketToken");
        if (!token) {
            const interval = setInterval(() => {
                const t = localStorage.getItem("socketToken");
                if (t) {
                    clearInterval(interval);
                    connect(t);
                }
            }, 2000);
            return () => clearInterval(interval);
        } else {
            connect(token);
        }

        function connect(t) {
            const s = io({
                auth: { token: t },
            });

            s.on("connect", () => {
                console.log("Socket connected:", s.id);
            });

            s.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            setSocket(s);
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}