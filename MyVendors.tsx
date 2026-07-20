"use client"

import { useEffect, useState } from "react"
import { Search, ChevronRight, MessageCircle } from "lucide-react"
import { Input } from "./ui/input"
import { useNavigate } from "react-router-dom"
import { getMessagesList } from "@/services/chat"

interface ChatMessage {
  id: string
  content: string
  timestamp: Date
  sender: "user" | "vendor"
}






function VendorChatList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState<any[]>([]); // Adjust the type if you have specific types
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('auth') as string);
    async function fetch() {
      const list = await getMessagesList(user?.id);
      // Map the data to fit the component's needs
      const formattedChats = list.map((chat: any) => ({
        id: chat.receiverId,
        userId: chat.receiverId,
        userName: chat.name, // 'Awesome Store' or 'Username'
        userImage: "/placeholder.svg", // Add logic for dynamic user image if needed
        lastMessage: {
          content: chat.lastMessage.content,
          sender: chat.lastMessage.sender || "vendor", // Adjust based on sender role
          timestamp: chat.lastMessage.createdAt,
        },
      }));
      setChats(formattedChats);
      console.log(list, "abc");
    }
    fetch();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (userId: string, userName: string) => {
    navigate(`/chat/${userId}?name=${encodeURIComponent(userName)}&type=user`);
  };

  const truncateMessage = (message: string) => {
    return message.length > 30 ? message.substring(0, 30) + "..." : message;
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(); // Customize the format if needed
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-lg overflow-hidden">

      {/* Search Bar */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search clients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-grow overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleChatClick(chat.userId, chat.userName)}
            >
              {/* User Avatar */}
              <div className="relative mr-3">
                <img
                  src={chat.userImage || "/placeholder.svg"}
                  alt={chat.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {/* Chat Info */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">{chat.userName}</h3>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(chat.lastMessage.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage.sender === "user" && truncateMessage(chat.lastMessage.content)}
                  {chat.lastMessage.sender === "vendor" && (
                    <span className="flex items-center">
                      <span className="mr-1">You:</span>
                      {truncateMessage(chat.lastMessage.content)}
                    </span>
                  )}
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-400 ml-2" />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
            <MessageCircle size={48} className="mb-2 opacity-30" />
            <p className="mb-2">No conversations found</p>
            <p className="text-sm text-center">
              {searchTerm ? `No clients matching "${searchTerm}"` : "You don't have any client conversations yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorChatList;
