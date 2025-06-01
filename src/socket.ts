import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./types/socketEvents.js";
import {
  addMessageToRoom,
  cleanUpRooms,
  getMessagesForRoom,
  getRoomIdForUser,
  joinRoom,
  leaveRoom,
} from "./utils/roomManager.js";
import {
  handleAnswer,
  handleIceCandidates,
  handleOffer,
} from "./utils/signalingHandlers.js";
import {
  addUserSocketMapping,
  getSocketIdByUserId,
  getUserIdBySocketId,
  removeUserSocketMapping,
} from "./utils/userSocketMap.js";

const socketSetup = (server: HTTPServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_ORIGIN,
    },
  });

  io.on(
    "connection",
    (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      console.log("A user connected: ", socket.id);

      socket.on("disconnect", () => {
        console.log(`User disconnected: `, socket.id);
        removeUserSocketMapping(socket.id);
        cleanUpRooms(socket.id);
      });

      socket.on("join-room", async ({ roomId, user }) => {
        joinRoom(roomId, socket.id);

        addUserSocketMapping(user, socket.id);

        // Emit chat history for the room when a new user joins
        const roomMessages = getMessagesForRoom(roomId);

        socket.emit("chat-history", roomMessages); // Emit chat history to the room

        await socket.join(roomId);

        console.log("RoomId: ", roomId);

        console.log(
          `User with id: ${socket.id} joined room with room id: ${roomId}`,
        );
        console.log(
          "----------------------------------------------------------------",
        );

        socket.to(roomId).emit("user-joined", { joinedUser: user });

        const clientsInRoom = Array.from(
          io.sockets.adapter.rooms.get(roomId) ?? [],
        );
        const otherUsers = clientsInRoom.filter((id) => id !== socket.id);

        otherUsers.forEach((otherSocketId) => {
          const otherUser = getUserIdBySocketId(otherSocketId); // Returns `User`

          if (otherUser) {
            socket.emit("user-joined", { joinedUser: otherUser });
          }
        });
      });

      socket.on("leave-room", async (roomId) => {
        leaveRoom(roomId, socket.id);

        await socket.leave(roomId);
        console.log(
          `User with id: ${socket.id} left room with room id: ${roomId}`,
        );

        socket.to(roomId).emit("user-left", { userId: socket.id });
      });

      socket.on("update-media-state", ({ cameraOn, micOn, userId }) => {
        const roomId = getRoomIdForUser(userId);

        if (!roomId) return;

        socket.to(roomId).emit("media-state-updated", {
          cameraOn,
          micOn,
          userId,
        });
      });

      socket.on("chat:message", (message) => {
        const { receiverId, roomId, type } = message;

        if (!roomId) {
          console.warn("chat:message received without roomId.");
          return;
        }

        addMessageToRoom(roomId, message);

        if (type === "group" || !receiverId || receiverId === "everyone") {
          // Broadcast to all in room *except sender*
          socket.to(roomId).emit("chat-message-response", message);
        } else if (type === "direct") {
          const receiverSocketId = getSocketIdByUserId(receiverId);

          // Send only to the intended receiver
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("chat-message-response", message);
          }
        }
      });

      //Signaling Handlers

      handleOffer(socket);

      handleAnswer(socket);

      handleIceCandidates(socket);
    },
  );
};

export default socketSetup;
