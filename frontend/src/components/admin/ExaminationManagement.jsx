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
import { Plus, Edit, Trash2, Calendar, Clock, FileText } from "lucide-react"

function ExaminationManagement() {
  const [examinations, setExaminations] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    exam_type: "",
    subject_id: "",
    class_id: "",
    date: "",
    start_time: "",
    end_time: "",
    total_marks: "",
    created_by: "",
  })

  useEffect(() => {
    fetchExaminations()
    fetchSubjects()
    fetchClasses()
    fetchTeachers()
  }, [])

  const fetchExaminations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/examinations/")
      setExaminations(response.data)
    } catch (error) {
      console.error("Error fetching examinations:", error)
      // Demo data
      setExaminations([
        {
          id: 1,
          name: "Mid Term Mathematics",
          exam_type: "mid_term",
          subject: { name: "Mathematics" },
          class_assigned: { name: "Class 10", section: "A" },
          date: "2023-12-15",
          start_time: "09:00",
          end_time: "12:00",
          total_marks: 100,
          created_by: { first_name: "John", last_name: "Smith" },
        },
        {
          id: 2,
          name: "Physics Unit Test",
          exam_type: "internal",
          subject: { name: "Physics" },
          class_assigned: { name: "Class 11", section: "B" },
          date: "2023-12-20",
          start_time: "10:00",
          end_time: "11:30",
          total_marks: 50,
          created_by: { first_name: "Sarah", last_name: "Johnson" },
        },
      ])
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

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/classes/")
      setClasses(response.data)
    } catch (error) {
      console.error("Error fetching classes:", error)
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
      if (editingExam) {
        await axios.put(`http://localhost:8000/api/examinations/${editingExam.id}/`, formData)
      } else {
        await axios.post("http://localhost:8000/api/examinations/", formData)
      }
      fetchExaminations()
      setIsDialogOpen(false)
      resetForm()
      alert(`Examination ${editingExam ? "updated" : "created"} successfully!`)
    } catch (error) {
      console.error("Error saving examination:", error)
      alert("Error saving examination")
    }
  }

  const handleEdit = (exam) => {
    setEditingExam(exam)
    setFormData({
      name: exam.name,
      exam_type: exam.exam_type,
      subject_id: exam.subject.id,
      class_id: exam.class_assigned.id,
      date: exam.date,
      start_time: exam.start_time,
      end_time: exam.end_time,
      total_marks: exam.total_marks.toString(),
      created_by: exam.created_by.id,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this examination?")) {
      try {
        await axios.delete(`http://localhost:8000/api/examinations/${id}/`)
        fetchExaminations()
        alert("Examination deleted successfully!")
      } catch (error) {
        console.error("Error deleting examination:", error)
        alert("Error deleting examination")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      exam_type: "",
      subject_id: "",
      class_id: "",
      date: "",
      start_time: "",
      end_time: "",
      total_marks: "",
      created_by: "",
    })
    setEditingExam(null)
  }

  const examTypes = [
    { value: "internal", label: "Internal Assessment" },
    { value: "mid_term", label: "Mid Term" },
    { value: "final", label: "Final Examination" },
    { value: "assignment", label: "Assignment" },
  ]

  const getExamTypeBadge = (type) => {
    const variants = {
      internal: "secondary",
      mid_term: "default",
      final: "destructive",
      assignment: "outline",
    }
    return <Badge variant={variants[type]}>{type.replace("_", " ").toUpperCase()}</Badge>
  }

  const getExamStatus = (date) => {
    const today = new Date()
    const examDate = new Date(date)

    if (examDate < today) {
      return <Badge variant="outline">Completed</Badge>
    } else if (examDate.toDateString() === today.toDateString()) {
      return <Badge variant="default">Today</Badge>
    } else {
      return <Badge variant="secondary">Upcoming</Badge>
    }
  }

  const upcomingExams = examinations.filter((exam) => new Date(exam.date) >= new Date())
  const completedExams = examinations.filter((exam) => new Date(exam.date) < new Date())

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Examination Management</h1>
          <p className="text-gray-600">Schedule and manage examinations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingExam ? "Edit Examination" : "Schedule New Examination"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Examination Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mid Term Mathematics"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="exam_type">Exam Type</Label>
                  <Select
                    value={formData.exam_type}
                    onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total_marks">Total Marks</Label>
                  <Input
                    id="total_marks"
                    type="number"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="created_by">Supervising Teacher</Label>
                  <Select
                    value={formData.created_by}
                    onValueChange={(value) => setFormData({ ...formData, created_by: value })}
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
              </div>

              <Button type="submit" className="w-full">
                {editingExam ? "Update Examination" : "Schedule Examination"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingExams.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedExams.length})</TabsTrigger>
          <TabsTrigger value="all">All Examinations</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Examinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{getExamTypeBadge(exam.exam_type)}</TableCell>
                      <TableCell>{exam.subject.name}</TableCell>
                      <TableCell>
                        {exam.class_assigned.name} - {exam.class_assigned.section}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(exam.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {exam.start_time} - {exam.end_time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{exam.total_marks}</TableCell>
                      <TableCell>{getExamStatus(exam.date)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(exam)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(exam.id)}>
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

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Completed Examinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Results</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{getExamTypeBadge(exam.exam_type)}</TableCell>
                      <TableCell>{exam.subject.name}</TableCell>
                      <TableCell>
                        {exam.class_assigned.name} - {exam.class_assigned.section}
                      </TableCell>
                      <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                      <TableCell>{exam.total_marks}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Examinations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examinations.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{getExamTypeBadge(exam.exam_type)}</TableCell>
                      <TableCell>{exam.subject.name}</TableCell>
                      <TableCell>
                        {exam.class_assigned.name} - {exam.class_assigned.section}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(exam.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {exam.start_time} - {exam.end_time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{exam.total_marks}</TableCell>
                      <TableCell>{getExamStatus(exam.date)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(exam)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(exam.id)}>
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
      </Tabs>
    </div>
  )
}

export default ExaminationManagement
