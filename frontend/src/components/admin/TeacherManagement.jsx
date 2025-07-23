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
import { Plus, Edit, Trash2, Users, Mail, Phone } from "lucide-react"

function TeacherManagement() {
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    employee_id: "",
    department: "",
    qualification: "",
    phone: "",
    subjects: [],
    classes: [],
  })

  useEffect(() => {
    fetchTeachers()
    fetchSubjects()
    fetchClasses()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teachers/")
      setTeachers(response.data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      // Demo data
      setTeachers([
        {
          id: 1,
          user: {
            first_name: "John",
            last_name: "Smith",
            email: "john.smith@college.edu",
            username: "jsmith",
            phone: "+1234567890",
          },
          employee_id: "EMP001",
          department: "Mathematics",
          qualification: "PhD in Mathematics",
          subjects: [{ name: "Mathematics" }, { name: "Statistics" }],
          classes: [{ name: "Class 10", section: "A" }],
        },
        {
          id: 2,
          user: {
            first_name: "Sarah",
            last_name: "Johnson",
            email: "sarah.johnson@college.edu",
            username: "sjohnson",
            phone: "+1234567891",
          },
          employee_id: "EMP002",
          department: "Physics",
          qualification: "MSc in Physics",
          subjects: [{ name: "Physics" }],
          classes: [{ name: "Class 11", section: "B" }],
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
      setSubjects([
        { id: 1, name: "Mathematics" },
        { id: 2, name: "Physics" },
        { id: 3, name: "Chemistry" },
      ])
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/classes/")
      setClasses(response.data)
    } catch (error) {
      console.error("Error fetching classes:", error)
      setClasses([
        { id: 1, name: "Class 10", section: "A" },
        { id: 2, name: "Class 11", section: "B" },
      ])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTeacher) {
        await axios.put(`http://localhost:8000/api/teachers/${editingTeacher.id}/`, formData)
      } else {
        await axios.post("http://localhost:8000/api/teachers/", formData)
      }
      fetchTeachers()
      setIsDialogOpen(false)
      resetForm()
      alert(`Teacher ${editingTeacher ? "updated" : "created"} successfully!`)
    } catch (error) {
      console.error("Error saving teacher:", error)
      alert("Error saving teacher")
    }
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      first_name: teacher.user.first_name,
      last_name: teacher.user.last_name,
      email: teacher.user.email,
      username: teacher.user.username,
      password: "",
      employee_id: teacher.employee_id,
      department: teacher.department,
      qualification: teacher.qualification,
      phone: teacher.user.phone || "",
      subjects: teacher.subjects.map((s) => s.id),
      classes: teacher.classes.map((c) => c.id),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`http://localhost:8000/api/teachers/${id}/`)
        fetchTeachers()
        alert("Teacher deleted successfully!")
      } catch (error) {
        console.error("Error deleting teacher:", error)
        alert("Error deleting teacher")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      employee_id: "",
      department: "",
      qualification: "",
      phone: "",
      subjects: [],
      classes: [],
    })
    setEditingTeacher(null)
  }

  const departments = ["Mathematics", "Physics", "Chemistry", "Computer Science", "English", "Biology"]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <p className="text-gray-600">Manage teaching staff and their assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    required
                  />
                </div>
              </div>

              {!editingTeacher && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingTeacher}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g., PhD in Mathematics"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingTeacher ? "Update Teacher" : "Add Teacher"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">Active teaching staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(teachers.map((t) => t.department)).size}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Classes/Teacher</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.length > 0
                ? (
                    teachers.reduce((total, teacher) => total + (teacher.classes?.length || 0), 0) / teachers.length
                  ).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Classes per teacher</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {teacher.user.first_name} {teacher.user.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{teacher.qualification}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{teacher.employee_id}</Badge>
                  </TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1" />
                        {teacher.user.email}
                      </div>
                      {teacher.user.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {teacher.user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects?.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes?.map((classItem, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {classItem.name}-{classItem.section}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(teacher)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(teacher.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {teachers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No teachers found</p>
              <p className="text-sm text-gray-400">Add your first teacher to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherManagement
