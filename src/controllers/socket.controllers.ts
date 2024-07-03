import { executionServices } from "../services/execution.services";
import { Types } from "mongoose";

interface ICard {
  _id: string;
  source: string;
  destination: string;
  index: number;
}

let connectedUsers: { [key: string]: { [socketId: string]: string } } = {}; // Object to track connected users per execution ID

const onlineAssigneesChange = async (io: any, execId: string) => {
  const users = Object.values(connectedUsers[execId] || {});
  io.to(execId).emit("connectedUsers", users);
};

export const socketControllers = {
  cardLocationChange: (socket: any) => {
    socket.on("cardLocationChange", async (card: ICard) => {
      const { id } = socket.handshake.query;

      try {
        if (id) {
          const execId = id;
          const cardId = card._id;
          socket.broadcast.to(execId).emit("cardLocationChange", card);

          await executionServices.editItemStatus(
            execId as Types.ObjectId,
            cardId,
            card.destination
          );
        }
      } catch (error) {
        socket.emit("updateError", { message: "Failed to update document." });
      }
    });
  },
  cardAssigneeChange: (socket: any) => {
    socket.on(
      "cardAssigneeChange",
      async (data: { assignee: string; cardId: string }) => {
        const { id } = socket.handshake.query;

        try {
          if (id) {
            const execId = id;

            socket.broadcast
              .to(execId)
              .emit("cardAssigneeChange", data.assignee, data.cardId);

            await executionServices.editItemAssignee(
              execId,
              data.cardId,
              data.assignee
            );
          }
        } catch (error) {
          socket.emit("updateError", { message: "Failed to update document." });
        }
      }
    );
  },
  onlineAssigneesChange: async (io: any, socket: any) => {
    const { user, id } = socket.handshake.query;

    if (user && id) {
      const execId = id;
      const userName = user.split("@")[0].split(".").join(" ");

      if (!connectedUsers[execId]) {
        connectedUsers[execId] = {};
      }

      connectedUsers[execId][socket.id] = userName;
      await onlineAssigneesChange(io, execId);
    }

    socket.on("disconnect", async () => {
      const { id } = socket.handshake.query;
      if (id) {
        const execId = id;
        if (connectedUsers[execId]) {
          delete connectedUsers[execId][socket.id];
          if (Object.keys(connectedUsers[execId]).length === 0) {
            delete connectedUsers[execId];
          }
          await onlineAssigneesChange(io, execId);
        }
      }
    });
  },
  disconnect: (socket: any) => {
    socket.on("disconnect", async () => {
      const { id } = socket.handshake.query;
      if (id) {
        const execId = id;
        if (connectedUsers[execId]) {
          delete connectedUsers[execId][socket.id];
          if (Object.keys(connectedUsers[execId]).length === 0) {
            delete connectedUsers[execId];
          }
          await onlineAssigneesChange(socket, execId);
        }
      }
    });
  },
};
