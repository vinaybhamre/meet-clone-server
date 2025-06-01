import { ChatMessage } from "../types/socketEvents.js";

const rooms = new Map<string, Set<string>>();
const messages = new Map<string, ChatMessage[]>();

export const joinRoom = (roomId: string, socketId: string) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set([socketId]));
  } else {
    const socketIds = rooms.get(roomId);
    socketIds?.add(socketId);
  }

  if (!messages.has(roomId)) {
    messages.set(roomId, []);
  }
};

export const leaveRoom = (roomId: string, socketId: string) => {
  const socketIds = rooms.get(roomId);

  if (!socketIds) return;

  socketIds.delete(socketId);

  if (socketIds.size === 0) {
    rooms.delete(roomId);
    messages.delete(roomId);
  }
};

export const cleanUpRooms = (socketId: string) => {
  for (const [roomId, socketIds] of rooms.entries()) {
    socketIds.delete(socketId);

    if (socketIds.size === 0) {
      rooms.delete(roomId);
      messages.delete(roomId);
    }
  }
};

export const getRoomIdForUser = (socketId: string): null | string => {
  for (const [roomId, socketIds] of rooms.entries()) {
    if (socketIds.has(socketId)) {
      return roomId;
    }
  }
  return null;
};

// Add a message to room's message history
export const addMessageToRoom = (roomId: string, message: ChatMessage) => {
  if (messages.has(roomId)) {
    messages.get(roomId)?.push(message);
  }
};

export const getMessagesForRoom = (roomId: string): ChatMessage[] => {
  return messages.get(roomId) ?? [];
};
