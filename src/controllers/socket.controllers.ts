import { executionServices } from "@/services/execution.services";
import { Types } from "mongoose";

interface ICard {
  _id: string;
  source: string;
  destination: string;
  index: number;
}

export const socketControllers = {
  cardLocationChange: (socket: any) => {
    socket.on("cardLocationChange", async (card: ICard) => {
      const { id } = socket.handshake.query;

      try {
        if (id) {
          const execId = id;
          const cardId = card._id;
          socket.broadcast.to(id).emit("cardLocationChange", card);

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
              .to(id)
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

  disconnect: (socket: any) => {},
};
