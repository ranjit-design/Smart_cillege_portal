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
import { Plus, Edit, Eye, Download, Calendar } from "lucide-react"

function AssignmentManagement() {
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    class_id: "",
    due_date: "",
    total_marks: "",
  })

  useEffect(() => {
    fetchAssignments()
    fetchClasses()
    fetchSubjects()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/assignments/")
      setAssignments(response.data)
    } catch (error) {
      console.error("Error fetching assignments:", error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/classes/")
      setClasses(response.data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/subjects/")
      setSubjects(response.data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAssignment) {
        await axios.put(`http://localhost:8000/api/assignments/${editingAssignment.id}/`, formData)
      } else {
        await axios.post("http://localhost:8000/api/assignments/", formData)
      }
      fetchAssignments()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving assignment:", error)
    }
  }

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title,
      description: assignment.description,
      subject_id: assignment.subject_id,
      class_id: assignment.class_id,
      due_date: assignment.due_date,
      total_marks: assignment.total_marks,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject_id: "",
      class_id: "",
      due_date: "",
      total_marks: "",
    })
    setEditingAssignment(null)
  }

  const getStatusBadge = (dueDate, submissionCount, totalStudents) => {
    const today = new Date()
    const due = new Date(dueDate)
    const isOverdue = due < today

    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (submissionCount === totalStudents) {
      return <Badge variant="default">Completed</Badge>
    } else {
      return <Badge variant="secondary">Active</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignment Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAssignment ? "Edit Assignment" : "Create New Assignment"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
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

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>{assignment.subject_name}</TableCell>
                  <TableCell>
                    {assignment.class_name} - {assignment.class_section}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{assignment.total_marks}</TableCell>
                  <TableCell>
                    {assignment.submission_count}/{assignment.total_students}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(assignment.due_date, assignment.submission_count, assignment.total_students)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(assignment)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssignmentManagement
