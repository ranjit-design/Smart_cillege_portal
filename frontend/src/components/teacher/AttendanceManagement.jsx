"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"

function AttendanceManagement() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/classes/")
      setClasses(response.data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/students/?class_id=${selectedClass}`)
      setStudents(response.data)

      // Initialize attendance state
      const initialAttendance = {}
      response.data.forEach((student) => {
        initialAttendance[student.id] = false
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }))
  }

  const handleSubmit = async () => {
    try {
      const attendanceData = {
        class_id: selectedClass,
        date: format(selectedDate, "yyyy-MM-dd"),
        attendance_records: Object.entries(attendance).map(([studentId, isPresent]) => ({
          student_id: Number.parseInt(studentId),
          is_present: isPresent,
        })),
      }

      await axios.post("http://localhost:8000/api/attendance/", attendanceData)
      alert("Attendance saved successfully!")
    } catch (error) {
      console.error("Error saving attendance:", error)
      alert("Error saving attendance")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name} - {classItem.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSubmit} className="w-full" disabled={!selectedClass || students.length === 0}>
              <Save className="w-4 h-4 mr-2" />
              Save Attendance
            </Button>
          </CardContent>
        </Card>
      </div>

      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.roll_number}</TableCell>
                    <TableCell>
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendance[student.id] || false}
                        onCheckedChange={(checked) => handleAttendanceChange(student.id, checked)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AttendanceManagement
