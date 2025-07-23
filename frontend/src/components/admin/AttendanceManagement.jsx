"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, TrendingUp, TrendingDown, Users } from "lucide-react"
import { format } from "date-fns"

function AttendanceManagement() {
  const [attendanceData, setAttendanceData] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [stats, setStats] = useState({
    overallAttendance: 0,
    totalStudents: 0,
    presentToday: 0,
    lowAttendanceStudents: 0,
  })

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
    fetchAttendanceStats()
  }, [])

  useEffect(() => {
    if (selectedClass !== "all" || selectedSubject !== "all") {
      fetchAttendanceData()
    }
  }, [selectedClass, selectedSubject, selectedDate])

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

  const fetchAttendanceData = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedClass !== "all") params.append("class_id", selectedClass)
      if (selectedSubject !== "all") params.append("subject_id", selectedSubject)
      params.append("date", format(selectedDate, "yyyy-MM-dd"))

      const response = await axios.get(`http://localhost:8000/api/admin/attendance/?${params}`)
      setAttendanceData(response.data)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      // Demo data
      setAttendanceData([
        {
          id: 1,
          student_name: "John Doe",
          roll_number: "2023001",
          class_name: "Class 10-A",
          subject_name: "Mathematics",
          date: "2023-11-15",
          is_present: true,
          attendance_percentage: 85,
        },
        {
          id: 2,
          student_name: "Jane Smith",
          roll_number: "2023002",
          class_name: "Class 10-A",
          subject_name: "Mathematics",
          date: "2023-11-15",
          is_present: false,
          attendance_percentage: 72,
        },
      ])
    }
  }

  const fetchAttendanceStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/attendance-stats/")
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching attendance stats:", error)
      setStats({
        overallAttendance: 87,
        totalStudents: 1250,
        presentToday: 1089,
        lowAttendanceStudents: 45,
      })
    }
  }

  const downloadAttendanceReport = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedClass !== "all") params.append("class_id", selectedClass)
      if (selectedSubject !== "all") params.append("subject_id", selectedSubject)
      params.append("date", format(selectedDate, "yyyy-MM-dd"))

      const response = await axios.get(`http://localhost:8000/api/admin/attendance-report/?${params}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `attendance-report-${format(selectedDate, "yyyy-MM-dd")}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error downloading report:", error)
    }
  }

  const getAttendanceBadge = (percentage) => {
    if (percentage >= 85) return <Badge variant="default">Good</Badge>
    if (percentage >= 75) return <Badge variant="secondary">Average</Badge>
    return <Badge variant="destructive">Poor</Badge>
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-600">Monitor and manage student attendance</p>
        </div>
        <Button onClick={downloadAttendanceReport}>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overallAttendance}%</div>
            <Progress value={stats.overallAttendance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.presentToday / stats.totalStudents) * 100).toFixed(1)}% attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Attendance</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowAttendanceStudents}</div>
            <p className="text-xs text-muted-foreground">Students below 75%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="summary">Attendance Summary</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                          {classItem.name} - {classItem.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
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
                </div>

                <div>
                  <Button onClick={fetchAttendanceData} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Overall %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.roll_number}</TableCell>
                      <TableCell className="font-medium">{record.student_name}</TableCell>
                      <TableCell>{record.class_name}</TableCell>
                      <TableCell>{record.subject_name}</TableCell>
                      <TableCell>
                        <Badge variant={record.is_present ? "default" : "destructive"}>
                          {record.is_present ? "Present" : "Absent"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${getAttendanceColor(record.attendance_percentage)}`}>
                            {record.attendance_percentage}%
                          </span>
                          {getAttendanceBadge(record.attendance_percentage)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class-wise Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((classItem) => {
                  const classAttendance = Math.floor(Math.random() * 30) + 70 // Demo data
                  return (
                    <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">
                          {classItem.name} - {classItem.section}
                        </h4>
                        <p className="text-sm text-gray-600">Capacity: {classItem.capacity}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{classAttendance}%</div>
                        <Progress value={classAttendance} className="w-32 mt-1" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Attendance trend chart will be displayed here</p>
                  <p className="text-sm text-gray-400">Integration with charting library required</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Attendance Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "John Doe", percentage: 65, class: "10-A" },
                    { name: "Jane Smith", percentage: 72, class: "10-B" },
                    { name: "Mike Johnson", percentage: 68, class: "11-A" },
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">Class {student.class}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-red-600 font-medium">{student.percentage}%</span>
                        <Badge variant="destructive" className="ml-2">
                          Action Required
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AttendanceManagement
