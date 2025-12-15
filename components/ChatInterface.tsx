"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  read: boolean;
}

export default function ChatInterface({ receiverId }: { receiverId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [receiverTyping, setReceiverTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { token, user } = useAuth();
  const { socket, sendMessage, sendTyping } = useSocket(token || "");

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on("receive-message", (data: Omit<Message, "id" | "read">) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now().toString(),
          read: true,
        },
      ]);
    });

    // Listen for typing indicators
    socket.on(
      "user-typing",
      (data: { senderId: string; isTyping: boolean }) => {
        if (data.senderId === receiverId) {
          setReceiverTyping(data.isTyping);
        }
      }
    );

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
    };
  }, [socket, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !user) return;

    const messageData = {
      receiverId,
      content: newMessage,
    };

    sendMessage(messageData);

    // Add to local messages immediately
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newMessage,
        senderId: user.id,
        receiverId,
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]);

    setNewMessage("");
    sendTyping(receiverId, false);
  };

  const handleTyping = (typing: boolean) => {
    sendTyping(receiverId, typing);
    setIsTyping(typing);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto border rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold">Chat with User</h2>
        {receiverTyping && <p className="text-sm text-gray-500">Typing...</p>}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                message.senderId === user?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping(e.target.value.length > 0);
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        {isTyping && (
          <p className="text-sm text-gray-500 mt-2">You are typing...</p>
        )}
      </div>
    </div>
  );
}
