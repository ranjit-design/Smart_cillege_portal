"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Calendar, Clock, MapPin } from "lucide-react"

function ScheduleManagement() {
  const [schedules, setSchedules] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [formData, setFormData] = useState({
    class_id: "",
    subject_id: "",
    teacher_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    room_number: "",
  })

  useEffect(() => {
    fetchSchedules()
    fetchClasses()
    fetchSubjects()
    fetchTeachers()
  }, [])

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/schedules/")
      setSchedules(response.data)
    } catch (error) {
      console.error("Error fetching schedules:", error)
      // Demo data
      setSchedules([
        {
          id: 1,
          class_assigned: { name: "Class 10", section: "A" },
          subject: { name: "Mathematics" },
          teacher: { user: { first_name: "John", last_name: "Smith" } },
          day_of_week: "monday",
          start_time: "09:00",
          end_time: "10:00",
          room_number: "101",
        },
        {
          id: 2,
          class_assigned: { name: "Class 10", section: "A" },
          subject: { name: "Physics" },
          teacher: { user: { first_name: "Sarah", last_name: "Johnson" } },
          day_of_week: "monday",
          start_time: "10:00",
          end_time: "11:00",
          room_number: "201",
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

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/subjects/")
      setSubjects(response.data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teachers/")
      setTeachers(response.data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSchedule) {
        await axios.put(`http://localhost:8000/api/schedules/${editingSchedule.id}/`, formData)
      } else {
        await axios.post("http://localhost:8000/api/schedules/", formData)
      }
      fetchSchedules()
      setIsDialogOpen(false)
      resetForm()
      alert(`Schedule ${editingSchedule ? "updated" : "created"} successfully!`)
    } catch (error) {
      console.error("Error saving schedule:", error)
      alert("Error saving schedule")
    }
  }

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      class_id: schedule.class_assigned.id,
      subject_id: schedule.subject.id,
      teacher_id: schedule.teacher.id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      room_number: schedule.room_number,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await axios.delete(`http://localhost:8000/api/schedules/${id}/`)
        fetchSchedules()
        alert("Schedule deleted successfully!")
      } catch (error) {
        console.error("Error deleting schedule:", error)
        alert("Error deleting schedule")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      class_id: "",
      subject_id: "",
      teacher_id: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      room_number: "",
    })
    setEditingSchedule(null)
  }

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
  ]

  const organizeScheduleByDay = () => {
    const organized = {}
    daysOfWeek.forEach((day) => {
      organized[day.value] = schedules
        .filter((schedule) => schedule.day_of_week === day.value)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
    })
    return organized
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDayBadge = (day) => {
    const colors = {
      monday: "default",
      tuesday: "secondary",
      wednesday: "outline",
      thursday: "default",
      friday: "secondary",
      saturday: "outline",
    }
    return <Badge variant={colors[day]}>{day.charAt(0).toUpperCase() + day.slice(1)}</Badge>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Schedule Management</h1>
          <p className="text-gray-600">Manage class schedules and timetables</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={formData.class_id}
                    onValueChange={(value) => setFormData({ ...formData, class_id: value })}
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
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject_id}
                    onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teacher">Teacher</Label>
                  <Select
                    value={formData.teacher_id}
                    onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.user.first_name} {teacher.user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="day">Day of Week</Label>
                  <Select
                    value={formData.day_of_week}
                    onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="room_number">Room Number</Label>
                  <Input
                    id="room_number"
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    placeholder="e.g., 101"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingSchedule ? "Update Schedule" : "Add Schedule"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Schedule List</TabsTrigger>
          <TabsTrigger value="timetable">Weekly Timetable</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        {schedule.class_assigned.name} - {schedule.class_assigned.section}
                      </TableCell>
                      <TableCell>{schedule.subject.name}</TableCell>
                      <TableCell>
                        {schedule.teacher.user.first_name} {schedule.teacher.user.last_name}
                      </TableCell>
                      <TableCell>{getDayBadge(schedule.day_of_week)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {schedule.room_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(schedule.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(organizeScheduleByDay()).map(([day, daySchedules]) => (
              <Card key={day}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {daySchedules.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedules.map((schedule) => (
                        <div key={schedule.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{schedule.subject.name}</h4>
                            <span className="text-xs text-gray-500">
                              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {schedule.class_assigned.name} - {schedule.class_assigned.section}
                          </p>
                          <p className="text-xs text-gray-600">
                            {schedule.teacher.user.first_name} {schedule.teacher.user.last_name}
                          </p>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                            <span className="text-xs text-gray-500">Room {schedule.room_number}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No classes scheduled</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ScheduleManagement
