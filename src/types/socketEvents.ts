import { User } from "./appTypes.js";

export interface ChatMessage {
  content: string;
  id: string;
  receiverId: null | string; // null or "everyone" means group message
  roomId: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  type?: "direct" | "group";
}

export interface ClientToServerEvents {
  answer: (payload: {
    answer: RTCSessionDescriptionPayload;
    senderId: string;
    targetId: string;
  }) => void;

  "chat:message": (payload: ChatMessage) => void;

  "ice-candidates": (payload: {
    candidates: RTCIceCandidatePayload[];
    senderId: string;
    targetId: string;
  }) => void;

  "join-room": ({ roomId, user }: { roomId: string; user: User }) => void;

  "leave-room": (roomId: string) => void;

  offer: (payload: {
    offer: RTCSessionDescriptionPayload;
    senderId: string;
    targetId: string;
  }) => void;

  "update-media-state": (payload: {
    cameraOn: boolean;
    micOn: boolean;
    userId: string;
  }) => void;
}

export interface RTCIceCandidatePayload {
  candidate: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}

export interface RTCSessionDescriptionPayload {
  sdp: string;
  type: "answer" | "offer";
}

export interface ServerToClientEvents {
  answer: (payload: {
    answer: RTCSessionDescriptionPayload;
    senderId: string;
  }) => void;

  "chat-history": (messages: ChatMessage[]) => void;

  "chat-message-response": (payload: ChatMessage) => void;

  "ice-candidates": (payload: {
    candidates: RTCIceCandidatePayload[];
    senderId: string;
  }) => void;

  "media-state-updated": (payload: {
    cameraOn: boolean;
    micOn: boolean;
    userId: string;
  }) => void;

  offer: (payload: {
    offer: RTCSessionDescriptionPayload;
    senderId: string;
  }) => void;

  "user-joined": ({ joinedUser }: { joinedUser: User }) => void;

  "user-left": (userId: { userId: string }) => void;
}
