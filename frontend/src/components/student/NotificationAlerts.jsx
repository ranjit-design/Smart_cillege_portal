"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertCircle, Info, CheckCircle, X } from "lucide-react"

function NotificationAlerts() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/notifications/")
      setNotifications(response.data)
      setUnreadCount(response.data.filter((n) => !n.is_read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Demo data
      const demoNotifications = [
        {
          id: 1,
          title: "Assignment Due Tomorrow",
          content: "Math Assignment 1 is due tomorrow at 11:59 PM. Please submit on time.",
          priority: "high",
          created_at: "2023-11-14T10:00:00Z",
          is_read: false,
          type: "assignment",
        },
        {
          id: 2,
          title: "Exam Schedule Released",
          content: "Mid-term examination schedule has been released. Check your timetable.",
          priority: "medium",
          created_at: "2023-11-13T14:30:00Z",
          is_read: false,
          type: "exam",
        },
        {
          id: 3,
          title: "Holiday Notice",
          content: "College will remain closed on November 20th due to public holiday.",
          priority: "low",
          created_at: "2023-11-12T09:15:00Z",
          is_read: true,
          type: "general",
        },
        {
          id: 4,
          title: "Library Hours Extended",
          content: "Library hours have been extended till 10 PM during exam period.",
          priority: "medium",
          created_at: "2023-11-11T16:45:00Z",
          is_read: true,
          type: "general",
        },
      ]
      setNotifications(demoNotifications)
      setUnreadCount(demoNotifications.filter((n) => !n.is_read).length)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:8000/api/notifications/${notificationId}/`, {
        is_read: true,
      })

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post("http://localhost:8000/api/notifications/mark-all-read/")

      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8000/api/notifications/${notificationId}/`)

      const deletedNotification = notifications.find((n) => n.id === notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))

      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "medium":
        return <Info className="w-5 h-5 text-yellow-500" />
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    }
    return <Badge variant={variants[priority]}>{priority.toUpperCase()}</Badge>
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "assignment":
        return "📝"
      case "exam":
        return "📊"
      case "general":
        return "📢"
      default:
        return "📋"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const unreadNotifications = notifications.filter((n) => !n.is_read)
  const readNotifications = notifications.filter((n) => n.is_read)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-3">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Unread Notifications
            </h2>
            <div className="space-y-3">
              {unreadNotifications.map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-blue-500 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(notification.priority)}
                          <span className="text-lg">{getTypeIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(notification.priority)}
                              <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{notification.content}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => markAsRead(notification.id)}>
                              Mark as Read
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteNotification(notification.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Read Notifications
            </h2>
            <div className="space-y-3">
              {readNotifications.map((notification) => (
                <Card key={notification.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(notification.priority)}
                          <span className="text-lg">{getTypeIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(notification.priority)}
                              <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{notification.content}</p>
                          <Button size="sm" variant="outline" onClick={() => deleteNotification(notification.id)}>
                            <X className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400">You'll see important updates here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default NotificationAlerts
