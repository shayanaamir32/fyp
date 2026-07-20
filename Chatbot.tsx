"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import "./Chatbot.css"
import { socket } from "./socket"

interface Message {
  id: string
  content: string
  sender: "bot" | "user"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your EventPro assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
]

// Sample responses for demo purposes


function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("ajaj")
      setIsConnected(false);
    }



    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("bot_response", onBotResponse);

    function onBotResponse(data: { response: string }) {
      console.log(data, "iaiai")

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: new Date(),
      }

      // Simulate typing delay of 2–3 seconds
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [...prev, botMessage])
      }, 2000 + Math.random() * 1000) // 2–3 seconds delay
    }


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("bot_response", onBotResponse);
    };

  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    socket.emit("chat", { query: newMessage });
    setNewMessage("")
    setIsTyping(true)

    // Simulate bot thinking and responding
    // Random delay between 1-2 seconds
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-[#120727] hover:bg-[#1d0b3d] shadow-lg flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isMinimized ? "w-72 h-16" : "w-80 sm:w-96 h-[500px]"
            }`}
        >
          {/* Chat Header */}
          <div className="bg-[#120727] text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <h3 className="font-semibold">EventPro Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleMinimize} className="text-white hover:text-gray-300 focus:outline-none">
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button onClick={toggleChat} className="text-white hover:text-gray-300 focus:outline-none">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <div className="h-[calc(500px-128px)] overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${message.sender === "user" ? "bg-[#120727] text-white" : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === "bot" ? (
                        <Bot size={16} className="mr-1" />
                      ) : (
                        <User size={16} className="mr-1" />
                      )}
                      <span className="text-xs opacity-75">{message.sender === "bot" ? "Assistant" : "You"}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <div className="text-right mt-1">
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Bot size={16} className="mr-1" />
                      <span className="text-xs opacity-75">Assistant</span>
                    </div>
                    <div className="flex py-2">
                      <span className="h-2 w-2 bg-gray-600 rounded-full mr-1 animate-bounce"></span>
                      <span
                        className="h-2 w-2 bg-gray-600 rounded-full mr-1 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat Input */}
          {!isMinimized && (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  className="bg-[#120727] hover:bg-[#1d0b3d]"
                  disabled={!newMessage.trim() || isTyping}
                >
                  <Send size={18} />
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatBot

