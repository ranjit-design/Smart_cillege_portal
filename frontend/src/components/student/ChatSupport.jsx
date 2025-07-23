"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, User, Bot } from "lucide-react"

function ChatSupport() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    fetchMessages()
    // Add some demo messages
    setMessages([
      {
        id: 1,
        sender: "support",
        message: "Hello! How can I help you today?",
        timestamp: new Date(Date.now() - 60000),
        sender_name: "Support Team",
      },
      {
        id: 2,
        sender: "student",
        message: "I'm having trouble accessing my assignment submissions.",
        timestamp: new Date(Date.now() - 30000),
        sender_name: "You",
      },
      {
        id: 3,
        sender: "support",
        message: "I can help you with that. Can you tell me which specific assignment you're trying to access?",
        timestamp: new Date(Date.now() - 15000),
        sender_name: "Support Team",
      },
    ])
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/chat-messages/")
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageData = {
      message: newMessage,
      sender: "student",
      timestamp: new Date(),
      sender_name: "You",
    }

    try {
      // Add message to local state immediately
      setMessages((prev) => [...prev, { ...messageData, id: Date.now() }])
      setNewMessage("")
      setIsTyping(true)

      // Send to backend
      await axios.post("http://localhost:8000/api/chat-messages/", {
        message: newMessage,
        receiver_type: "support",
      })

      // Simulate support response after a delay
      setTimeout(() => {
        const supportResponse = {
          id: Date.now() + 1,
          sender: "support",
          message: "Thank you for your message. Our support team will get back to you shortly.",
          timestamp: new Date(),
          sender_name: "Support Team",
        }
        setMessages((prev) => [...prev, supportResponse])
        setIsTyping(false)
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsTyping(false)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chat Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Support Team</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-xs text-gray-600">General support and help</p>
              </div>

              <div className="p-3 border rounded-lg cursor-pointer opacity-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Academic Advisor</span>
                  <Badge variant="secondary">Offline</Badge>
                </div>
                <p className="text-xs text-gray-600">Academic guidance</p>
              </div>

              <div className="p-3 border rounded-lg cursor-pointer opacity-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Technical Support</span>
                  <Badge variant="secondary">Offline</Badge>
                </div>
                <p className="text-xs text-gray-600">Technical issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div>
                  <span>Support Team</span>
                  <Badge variant="default" className="ml-2">
                    Online
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.sender === "student" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.sender === "student" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "student" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${message.sender === "student" ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <MessageCircle className="w-6 h-6 mb-2" />
              <span className="text-sm">Assignment Help</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <User className="w-6 h-6 mb-2" />
              <span className="text-sm">Account Issues</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <Bot className="w-6 h-6 mb-2" />
              <span className="text-sm">Technical Support</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <MessageCircle className="w-6 h-6 mb-2" />
              <span className="text-sm">General Inquiry</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChatSupport
