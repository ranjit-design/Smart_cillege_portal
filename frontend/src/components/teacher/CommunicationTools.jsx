"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Send, MessageSquare, Bell, Users } from "lucide-react"

function CommunicationTools() {
  const [messages, setMessages] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [students, setStudents] = useState([])
  const [messageForm, setMessageForm] = useState({
    recipient_id: "",
    message: "",
  })
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    target_class: "",
    priority: "medium",
  })

  useEffect(() => {
    fetchMessages()
    fetchAnnouncements()
    fetchStudents()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/messages/")
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/announcements/")
      setAnnouncements(response.data)
    } catch (error) {
      console.error("Error fetching announcements:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/students/")
      setStudents(response.data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/api/messages/", messageForm)
      setMessageForm({ recipient_id: "", message: "" })
      fetchMessages()
      alert("Message sent successfully!")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/api/announcements/", announcementForm)
      setAnnouncementForm({ title: "", content: "", target_class: "", priority: "medium" })
      fetchAnnouncements()
      alert("Announcement created successfully!")
    } catch (error) {
      console.error("Error creating announcement:", error)
    }
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "destructive",
      urgent: "destructive",
    }
    return <Badge variant={variants[priority]}>{priority.toUpperCase()}</Badge>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Communication Tools</h1>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Send Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient</Label>
                    <Select
                      value={messageForm.recipient_id}
                      onValueChange={(value) => setMessageForm({ ...messageForm, recipient_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.first_name} {student.last_name} ({student.roll_number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{message.receiver_name || message.sender_name}</span>
                        <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                      <Badge variant={message.is_read ? "secondary" : "default"} className="mt-2">
                        {message.is_read ? "Read" : "Unread"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Announcement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Create Announcement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={announcementForm.priority}
                      onValueChange={(value) => setAnnouncementForm({ ...announcementForm, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{announcement.title}</h4>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                        <span>{announcement.target_audience}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Broadcast Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="broadcast-title">Subject</Label>
                  <Input id="broadcast-title" placeholder="Enter message subject" />
                </div>
                <div>
                  <Label htmlFor="broadcast-audience">Target Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-students">All Students</SelectItem>
                      <SelectItem value="class-specific">Specific Class</SelectItem>
                      <SelectItem value="subject-specific">Subject Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="broadcast-message">Message</Label>
                  <Textarea id="broadcast-message" rows={6} placeholder="Enter your broadcast message" />
                </div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CommunicationTools
