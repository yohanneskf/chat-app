// app/chat/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ChatInterface from "@/components/ChatInterface";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { user, logout, loading } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>("user-id-here"); // Default user for demo
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chat App</h1>
              <p className="text-gray-600 text-sm">
                Welcome,{" "}
                <span className="font-medium">{user.name || user.email}</span>
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Users List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4 h-[600px]">
            <h2 className="text-xl font-semibold mb-4 pb-3 border-b">
              Online Users
            </h2>
            <div className="space-y-2 overflow-y-auto max-h-[500px]">
              {/* Demo users - in real app, fetch from API */}
              <div
                onClick={() => setSelectedUser("user-id-here")}
                className={`p-3 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
                  selectedUser === "user-id-here"
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-xs text-green-500 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedUser("user-2")}
                className={`p-3 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
                  selectedUser === "user-2"
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-xs text-green-500 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedUser("user-3")}
                className={`p-3 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
                  selectedUser === "user-3"
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Alex Johnson</p>
                    <p className="text-xs text-gray-500">Offline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedUser ? (
              <ChatInterface receiverId={selectedUser} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center h-[600px] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Select a user to start chatting
                </h3>
                <p className="text-gray-600 max-w-md">
                  Choose from the online users list on the left to begin your
                  conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
