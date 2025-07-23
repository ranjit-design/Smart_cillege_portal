"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, BookOpen } from "lucide-react"

function SubjectManagement() {
  const [subjects, setSubjects] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "",
    description: "",
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/subjects/")
      setSubjects(response.data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
      // Demo data
      setSubjects([
        {
          id: 1,
          name: "Mathematics",
          code: "MATH101",
          credits: 4,
          description: "Advanced mathematics including calculus and algebra",
        },
        {
          id: 2,
          name: "Physics",
          code: "PHY101",
          credits: 3,
          description: "Fundamental physics concepts and laboratory work",
        },
        {
          id: 3,
          name: "Computer Science",
          code: "CS101",
          credits: 4,
          description: "Introduction to programming and computer systems",
        },
      ])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSubject) {
        await axios.put(`http://localhost:8000/api/subjects/${editingSubject.id}/`, formData)
      } else {
        await axios.post("http://localhost:8000/api/subjects/", formData)
      }
      fetchSubjects()
      setIsDialogOpen(false)
      resetForm()
      alert(`Subject ${editingSubject ? "updated" : "created"} successfully!`)
    } catch (error) {
      console.error("Error saving subject:", error)
      alert("Error saving subject")
    }
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      credits: subject.credits.toString(),
      description: subject.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`http://localhost:8000/api/subjects/${id}/`)
        fetchSubjects()
        alert("Subject deleted successfully!")
      } catch (error) {
        console.error("Error deleting subject:", error)
        alert("Error deleting subject")
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: "", code: "", credits: "", description: "" })
    setEditingSubject(null)
  }

  const getCreditsBadge = (credits) => {
    if (credits >= 4) return <Badge variant="default">{credits} Credits</Badge>
    if (credits >= 3) return <Badge variant="secondary">{credits} Credits</Badge>
    return <Badge variant="outline">{credits} Credits</Badge>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subject Management</h1>
          <p className="text-gray-600">Manage academic subjects and their details</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., MATH101"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Enter subject description..."
                />
              </div>
              <Button type="submit" className="w-full">
                {editingSubject ? "Update Subject" : "Add Subject"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.reduce((total, subject) => total + subject.credits, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Credits</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.length > 0
                ? (subjects.reduce((total, subject) => total + subject.credits, 0) / subjects.length).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Per subject</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subjects List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subject.code}</Badge>
                  </TableCell>
                  <TableCell>{getCreditsBadge(subject.credits)}</TableCell>
                  <TableCell className="max-w-xs truncate">{subject.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(subject)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {subjects.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No subjects found</p>
              <p className="text-sm text-gray-400">Add your first subject to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SubjectManagement
