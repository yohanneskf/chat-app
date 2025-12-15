import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";

interface MessageData {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

// Define Socket type
type SocketType = ReturnType<typeof io>;

export const useSocket = (token?: string) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const sendMessage = useCallback(
    (data: Omit<MessageData, "timestamp" | "senderId">) => {
      if (socket && isConnected) {
        socket.emit("send-message", data);
      }
    },
    [socket, isConnected]
  );

  const sendTyping = useCallback(
    (receiverId: string, isTyping: boolean) => {
      if (socket && isConnected) {
        socket.emit("typing", { receiverId, isTyping });
      }
    },
    [socket, isConnected]
  );

  return {
    socket,
    isConnected,
    sendMessage,
    sendTyping,
  };
};
