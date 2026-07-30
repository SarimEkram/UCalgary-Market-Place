import http from "http";
import app from "./app.js";
import { setupSocket, setIo } from "./socket.js";

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const ioInstance = setupSocket(server);
setIo(ioInstance);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});