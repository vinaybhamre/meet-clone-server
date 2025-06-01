import { User } from "../types/appTypes.js";

const userToSocketMap = new Map<string, string>();

const socketToUserMap = new Map<string, User>();

export const addUserSocketMapping = (user: User, socketId: string) => {
  userToSocketMap.set(user.id, socketId);
  socketToUserMap.set(socketId, user);
};

export const removeUserSocketMapping = (socketId: string) => {
  const user = socketToUserMap.get(socketId);

  if (user) {
    userToSocketMap.delete(user.id);
    socketToUserMap.delete(socketId);
  }
};

export const getSocketIdByUserId = (userId: string) =>
  userToSocketMap.get(userId);

export const getUserIdBySocketId = (socketId: string) =>
  socketToUserMap.get(socketId);
