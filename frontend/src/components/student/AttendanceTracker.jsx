"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, TrendingUp, TrendingDown } from "lucide-react"

function AttendanceTracker() {
  const [attendanceData, setAttendanceData] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [overallStats, setOverallStats] = useState({
    totalClasses: 0,
    attendedClasses: 0,
    percentage: 0,
  })

  useEffect(() => {
    fetchAttendanceData()
    fetchSubjects()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [attendanceData, selectedSubject])

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/attendance/")
      setAttendanceData(response.data)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/subjects/")
      setSubjects(response.data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const calculateStats = () => {
    let filteredData = attendanceData
    if (selectedSubject !== "all") {
      filteredData = attendanceData.filter((record) => record.subject_id === Number.parseInt(selectedSubject))
    }

    const totalClasses = filteredData.length
    const attendedClasses = filteredData.filter((record) => record.is_present).length
    const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0

    setOverallStats({
      totalClasses,
      attendedClasses,
      percentage: Math.round(percentage * 100) / 100,
    })
  }

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) return { status: "Good", color: "bg-green-500", variant: "default" }
    if (percentage >= 60) return { status: "Average", color: "bg-yellow-500", variant: "secondary" }
    return { status: "Poor", color: "bg-red-500", variant: "destructive" }
  }

  const attendanceStatus = getAttendanceStatus(overallStats.percentage)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalClasses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.attendedClasses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Percentage</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.percentage}%</div>
            <Progress value={overallStats.percentage} className="mt-2" />
            <Badge variant={attendanceStatus.variant} className="mt-2">
              {attendanceStatus.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-64">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData
                .filter((record) => selectedSubject === "all" || record.subject_id === Number.parseInt(selectedSubject))
                .map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.subject_name}</TableCell>
                    <TableCell>
                      <Badge variant={record.is_present ? "default" : "destructive"}>
                        {record.is_present ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.time}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendanceTracker
