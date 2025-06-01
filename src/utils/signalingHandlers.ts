import { Socket } from "socket.io";

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/socketEvents.js";

export const handleOffer = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  socket.on("offer", ({ offer, senderId, targetId }) => {
    socket.to(targetId).emit("offer", { offer, senderId });
  });
};

export const handleAnswer = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  socket.on("answer", ({ answer, senderId, targetId }) => {
    socket.to(targetId).emit("answer", { answer, senderId });
  });
};

export const handleIceCandidates = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  socket.on("ice-candidates", ({ candidates, senderId, targetId }) => {
    socket.to(targetId).emit("ice-candidates", { candidates, senderId });
  });
};
