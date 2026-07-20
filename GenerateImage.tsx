"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Download, User, Bot } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { genImage } from "@/services/cloudinary"

interface Message {
  type: "user" | "bot"
  content: string
  image?: string
}

function GenerateImage() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const userMessage: Message = { type: "user", content: prompt }
    setMessages((prev) => [...prev, userMessage])
    setPrompt("")
    setIsLoading(true)

    try {
      const res = await genImage(prompt)


      if (true) {
        const botMessage: Message = {
          type: "bot",
          content: "Here's the image you requested:",
          image: res,
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error generating image:", error)
      const errorMessage: Message = {
        type: "bot",
        content: "Sorry, I couldn't generate the image. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = "generated-image.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto mt-8 px-4 max-w-4xl h-[calc(100vh-200px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Image Generator</h1>

      <div className="flex-grow overflow-auto mb-4 bg-gray-100 rounded-lg p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}>
            <div
              className={`max-w-[70%] ${message.type === "user" ? "bg-[#120727] text-white" : "bg-white"} rounded-lg p-3 shadow`}
            >
              <div className="flex items-center mb-2">
                {message.type === "user" ? <User size={24} /> : <Bot size={24} />}
                <span className="ml-2 font-semibold">{message.type === "user" ? "You" : "AI"}</span>
              </div>
              <p>{message.content}</p>
              {message.image && (
                <div className="mt-2">
                  <img src={message.image} alt="Generated" className="w-full h-auto rounded-lg" />
                  <Button
                    onClick={() => handleDownload(message.image!)}
                    className="mt-2 w-full flex items-center justify-center"
                  >
                    <Download size={20} className="mr-2" />
                    Download Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : <Send size={20} />}
        </Button>
      </form>
    </div>
  )
}

export default GenerateImage
