"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Send, Phone, ArrowLeft, ImageIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getMessageHistory, sendMessage } from "@/services/chat";
import { getCloudinaryImage } from "@/services/cloudinary";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image";
}

interface VendorChatProps {
  receiverId?: string;
  receiverName?: string;
  receiverImage?: string;
}

const VendorChat: React.FC<VendorChatProps> = (props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("auth") as string);

  const senderId = user?.id; // <-- Logged-in user is always the sender
  const receiverId = id || props.receiverId; // <-- From URL or props

  const receiverName = props.receiverName || "Chat";
  const receiverImage = props.receiverImage || "/placeholder.svg";

  useEffect(() => {

    const fetchMessages = async () => {
      if (!senderId || !receiverId) return;

      try {
        const history = await getMessageHistory(senderId, receiverId);
        setMessages(
          history.map((msg: any) => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            type: msg.type,
            timestamp: new Date(msg.createdAt),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderId || !receiverId) return;
    if (newMessage.trim() === "" && !selectedImage) return;

    try {
      if (newMessage.trim() !== "") {
        const textMessage = {
          senderId,
          receiverId,
          content: newMessage,
          type: "text",
        };

        await sendMessage(textMessage);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            senderId,
            receiverId,
            content: newMessage,
            timestamp: new Date(),
            type: "text",
          },
        ]);
        setNewMessage("");
      }

      if (selectedImage) {
        // Upload the image to Cloudinary instead of using local URL
        const uploadedImageUrl = await getCloudinaryImage(selectedImage); // <-- This uploads and gets the real URL

        const imageMessage = {
          senderId,
          receiverId,
          content: uploadedImageUrl, // <- Use uploaded URL, not local
          type: "image",
        };

        await sendMessage(imageMessage);

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            senderId,
            receiverId,
            content: uploadedImageUrl,
            timestamp: new Date(),
            type: "image",
          },
        ]);
        setSelectedImage(null);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-[#120727] text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2 text-white hover:text-gray-300"
        >
          <ArrowLeft size={24} />
        </Button>
        <img src={receiverImage} alt={receiverName} className="w-10 h-10 rounded-full mr-3" />
        <div className="flex-grow">
          <h2 className="font-semibold">{receiverName}</h2>
          <p className="text-sm text-gray-300">Online</p>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
          <Phone size={24} />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => {
          const isSender = message.senderId === senderId;
          return (
            <div
              key={message.id}
              className={`mb-4 ${isSender ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${isSender
                  ? "bg-[#120727] text-white"
                  : "bg-white text-gray-800"
                  }`}
              >
                {message.type === "text" ? (
                  message.content
                ) : (
                  <img
                    src={message.content || "/placeholder.svg"}
                    alt="Uploaded"
                    className="max-w-xs rounded-lg"
                  />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white p-4 flex items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={triggerImageUpload}
          className="mr-2"
        >
          <ImageIcon size={20} />
        </Button>
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow mr-2"
        />
        <Button type="submit" className="bg-[#120727] text-white hover:bg-[#1d0b3d]">
          <Send size={20} />
        </Button>
      </form>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="bg-gray-200 p-2 flex items-center">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-10 h-10 object-cover rounded mr-2"
          />
          <span className="text-sm">{selectedImage.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedImage(null)}
            className="ml-auto"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendorChat;
