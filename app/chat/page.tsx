"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ChatInterface from "@/components/ChatInterface";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { user, logout, loading } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>(""); // In real app, fetch from API
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat App</h1>
            <p className="text-gray-600">Welcome, {user.name || user.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Users List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Online Users</h2>
            <div className="space-y-2">
              {/* In real app, map through users from API */}
              <div
                onClick={() => setSelectedUser("user-id-here")}
                className="p-3 hover:bg-gray-100 rounded cursor-pointer"
              >
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedUser ? (
              <ChatInterface receiverId={selectedUser} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Select a user to start chatting
                </h3>
                <p className="text-gray-600">
                  Choose from the online users list
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
