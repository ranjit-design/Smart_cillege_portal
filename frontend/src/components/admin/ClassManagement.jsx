"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

function ClassManagement() {
  const [classes, setClasses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    academic_year: "",
    capacity: "",
  })

  useEffect(() => {
    fetchClasses()
  }, [])

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
      if (editingClass) {
        await axios.put(`http://localhost:8000/api/classes/${editingClass.id}/`, formData)
      } else {
        await axios.post("http://localhost:8000/api/classes/", formData)
      }
      fetchClasses()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving class:", error)
    }
  }

  const handleEdit = (classItem) => {
    setEditingClass(classItem)
    setFormData({
      name: classItem.name,
      section: classItem.section,
      academic_year: classItem.academic_year,
      capacity: classItem.capacity,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axios.delete(`http://localhost:8000/api/classes/${id}/`)
        fetchClasses()
      } catch (error) {
        console.error("Error deleting class:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: "", section: "", academic_year: "", capacity: "" })
    setEditingClass(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClass ? "Edit Class" : "Add New Class"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  id="academic_year"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingClass ? "Update Class" : "Add Class"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classes List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.section}</TableCell>
                  <TableCell>{classItem.academic_year}</TableCell>
                  <TableCell>{classItem.capacity}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(classItem)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(classItem.id)}>
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
    </div>
  )
}

export default ClassManagement
