"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Bell, Eye, Send } from "lucide-react"

function NoticeManagement() {
  const [notices, setNotices] = useState([])
  const [classes, setClasses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    target_audience: "all",
    target_class_id: "",
    is_active: true,
  })

  useEffect(() => {
    fetchNotices()
    fetchClasses()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/notices/")
      setNotices(response.data)
    } catch (error) {
      console.error("Error fetching notices:", error)
      // Demo data
      setNotices([
        {
          id: 1,
          title: "Mid-term Examination Schedule",
          content:
            "The mid-term examinations will be conducted from December 15-20, 2023. Please check your individual timetables.",
          priority: "high",
          target_audience: "students",
          target_class: null,
          created_by: { first_name: "Admin", last_name: "User" },
          created_at: "2023-11-15T10:00:00Z",
          is_active: true,
        },
        {
          id: 2,
          title: "Library Hours Extended",
          content: "Library hours have been extended till 10 PM during examination period for better study facilities.",
          priority: "medium",
          target_audience: "all",
          target_class: null,
          created_by: { first_name: "Admin", last_name: "User" },
          created_at: "2023-11-14T14:30:00Z",
          is_active: true,
        },
        {
          id: 3,
          title: "Class 10-A Parent Meeting",
          content:
            "Parent-teacher meeting for Class 10-A is scheduled for November 25, 2023 at 2:00 PM in the main auditorium.",
          priority: "medium",
          target_audience: "class_specific",
          target_class: { name: "Class 10", section: "A" },
          created_by: { first_name: "Admin", last_name: "User" },
          created_at: "2023-11-13T09:15:00Z",
          is_active: true,
        },
      ])
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/classes/")
      setClasses(response.data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = { ...formData }
      if (formData.target_audience !== "class_specific") {
        submitData.target_class_id = null
      }

      if (editingNotice) {
        await axios.put(`http://localhost:8000/api/notices/${editingNotice.id}/`, submitData)
      } else {
        await axios.post("http://localhost:8000/api/notices/", submitData)
      }
      fetchNotices()
      setIsDialogOpen(false)
      resetForm()
      alert(`Notice ${editingNotice ? "updated" : "published"} successfully!`)
    } catch (error) {
      console.error("Error saving notice:", error)
      alert("Error saving notice")
    }
  }

  const handleEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      target_audience: notice.target_audience,
      target_class_id: notice.target_class?.id?.toString() || "",
      is_active: notice.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await axios.delete(`http://localhost:8000/api/notices/${id}/`)
        fetchNotices()
        alert("Notice deleted successfully!")
      } catch (error) {
        console.error("Error deleting notice:", error)
        alert("Error deleting notice")
      }
    }
  }

  const toggleNoticeStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/notices/${id}/`, {
        is_active: !currentStatus,
      })
      fetchNotices()
    } catch (error) {
      console.error("Error updating notice status:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      target_audience: "all",
      target_class_id: "",
      is_active: true,
    })
    setEditingNotice(null)
  }

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ]

  const audienceOptions = [
    { value: "all", label: "All Users" },
    { value: "students", label: "Students Only" },
    { value: "teachers", label: "Teachers Only" },
    { value: "class_specific", label: "Specific Class" },
  ]

  const getPriorityBadge = (priority) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "destructive",
      urgent: "destructive",
    }
    const colors = {
      low: "bg-gray-500",
      medium: "bg-blue-500",
      high: "bg-orange-500",
      urgent: "bg-red-500",
    }
    return (
      <Badge variant={variants[priority]} className={colors[priority]}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const getAudienceBadge = (audience, targetClass) => {
    if (audience === "class_specific" && targetClass) {
      return (
        <Badge variant="outline">
          {targetClass.name} - {targetClass.section}
        </Badge>
      )
    }
    return <Badge variant="outline">{audience.replace("_", " ").toUpperCase()}</Badge>
  }

  const activeNotices = notices.filter((notice) => notice.is_active)
  const inactiveNotices = notices.filter((notice) => !notice.is_active)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notice Management</h1>
          <p className="text-gray-600">Create and manage notices and announcements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Notice Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter notice title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Notice Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  placeholder="Enter notice content..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Select
                    value={formData.target_audience}
                    onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audienceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.target_audience === "class_specific" && (
                <div>
                  <Label htmlFor="target_class">Select Class</Label>
                  <Select
                    value={formData.target_class_id}
                    onValueChange={(value) => setFormData({ ...formData, target_class_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                          {classItem.name} - {classItem.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Publish immediately</Label>
              </div>

              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                {editingNotice ? "Update Notice" : "Publish Notice"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notices.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeNotices.length}</div>
            <p className="text-xs text-muted-foreground">Currently published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notices.filter((n) => n.priority === "high" || n.priority === "urgent").length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent notices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                notices.filter((n) => {
                  const noticeDate = new Date(n.created_at)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return noticeDate >= weekAgo
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Published this week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{notice.title}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">{notice.content}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(notice.priority)}</TableCell>
                  <TableCell>{getAudienceBadge(notice.target_audience, notice.target_class)}</TableCell>
                  <TableCell>
                    {notice.created_by.first_name} {notice.created_by.last_name}
                  </TableCell>
                  <TableCell>{new Date(notice.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={notice.is_active}
                        onCheckedChange={() => toggleNoticeStatus(notice.id, notice.is_active)}
                      />
                      <span className="text-sm">{notice.is_active ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(notice)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(notice.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {notices.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No notices found</p>
              <p className="text-sm text-gray-400">Create your first notice to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default NoticeManagement
