import { Server } from "socket.io";
import { AuthService } from "./auth";

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const user = AuthService.verifyToken(token);
    if (!user) {
      return next(new Error("Authentication error"));
    }

    (socket as any).user = user;
    next();
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.id}`);

    // Store user's socket ID
    onlineUsers.set(user.id, socket.id);

    // Notify others about online status
    socket.broadcast.emit("user-online", user.id);

    // Send message
    socket.on(
      "send-message",
      async (data: { receiverId: string; content: string }) => {
        const receiverSocketId = onlineUsers.get(data.receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", {
            ...data,
            senderId: user.id,
            timestamp: new Date().toISOString(),
          });
        }

        // You would also save to database here
        // For now, we'll just emit
      }
    );

    // Handle typing indicator
    socket.on("typing", (data: { receiverId: string; isTyping: boolean }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", {
          senderId: user.id,
          isTyping: data.isTyping,
        });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(user.id);
      socket.broadcast.emit("user-offline", user.id);
      console.log(`User disconnected: ${user.id}`);
    });
  });

  return io;
};
