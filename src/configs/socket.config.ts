import { socketControllers } from "../controllers/socket.controllers";
import { Server } from "socket.io";

export const socketConfig = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const id = socket.handshake.query.id;
    if (id) {
      socket.join(id);
    }

    socketControllers.cardLocationChange(socket);
    socketControllers.cardAssigneeChange(socket);
    socketControllers.disconnect(socket);
  });
};
