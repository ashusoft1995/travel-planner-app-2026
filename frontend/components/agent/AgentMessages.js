"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMoreVertical,
  FiSearch,
  FiUsers,
  FiMessageSquare,
  FiCircle,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AgentMessages({ token, user }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchOnlineUsers();
    const interval = setInterval(() => {
      fetchMessages();
      fetchOnlineUsers();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch("/api/messages/online-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOnlineUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch online users:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedChat) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          type: selectedChat ? "private" : "group",
          recipientId: selectedChat?.id || null,
          recipientName: selectedChat?.name || null,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const editMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newContent,
        }),
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const addReaction = async (messageId, emoji) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emoji,
        }),
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const filteredMessages = selectedChat
    ? messages.filter(msg => 
        (msg.type === "private" && 
         ((msg.senderId === user.id && msg.recipientId === selectedChat.id) ||
          (msg.senderId === selectedChat.id && msg.recipientId === user.id))))
    : messages.filter(msg => msg.type === "group");

  const groupedMessages = groupMessagesByDate(filteredMessages);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Group Chat */}
          <div
            onClick={() => setSelectedChat(null)}
            className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
              !selectedChat ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <FiUsers className="h-10 w-10 text-blue-500" />
                <FiCircle className="absolute bottom-0 right-0 h-3 w-3 text-green-500 fill-current" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Group Chat</p>
                <p className="text-sm text-gray-500">All members</p>
              </div>
            </div>
          </div>

          {/* Private Chats */}
          {onlineUsers.map((onlineUser) => (
            onlineUser.id !== user.id && (
              <div
                key={onlineUser.id}
                onClick={() => setSelectedChat(onlineUser)}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedChat?.id === onlineUser.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {onlineUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <FiCircle className="absolute bottom-0 right-0 h-3 w-3 text-green-500 fill-current" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{onlineUser.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{onlineUser.role}</p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedChat ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {selectedChat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedChat.name}</p>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </>
              ) : (
                <>
                  <FiUsers className="h-10 w-10 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Group Chat</p>
                    <p className="text-sm text-gray-500">All team members</p>
                  </div>
                </>
              )}
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <FiMoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="text-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {date}
                </span>
              </div>
              {dateMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.senderId === user.id ? "order-2" : "order-1"}`}>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.senderId === user.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      {message.deleted ? (
                        <p className="text-sm italic">{message.content}</p>
                      ) : (
                        <>
                          <p className="text-sm">{message.content}</p>
                          {message.edited && (
                            <p className="text-xs italic mt-1 opacity-75">(edited)</p>
                          )}
                        </>
                      )}
                    </div>
                    <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${
                      message.senderId === user.id ? "justify-end" : "justify-start"
                    }`}>
                      <span>{formatTime(message.createdAt)}</span>
                      {message.senderId === user.id && (
                        <span>
                          {message.read ? <FiCheckCircle className="h-4 w-4" /> : <FiCheck className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {reaction.emoji} {reaction.userName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <FiPaperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder={`Message ${selectedChat ? selectedChat.name : "group"}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <FiSmile className="h-5 w-5" />
            </button>
            <button
              onClick={sendMessage}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiSend className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
