"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Award, BarChart3 } from "lucide-react"

function MarksResultView() {
  const [marks, setMarks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [overallStats, setOverallStats] = useState({
    totalExams: 0,
    averageMarks: 0,
    highestMarks: 0,
    grade: "A",
  })

  useEffect(() => {
    fetchMarks()
    fetchSubjects()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [marks, selectedSubject])

  const fetchMarks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/marks/")
      setMarks(response.data)
    } catch (error) {
      console.error("Error fetching marks:", error)
      // Demo data
      setMarks([
        {
          id: 1,
          subject: "Mathematics",
          exam_name: "Mid Term",
          exam_type: "mid_term",
          marks_obtained: 85,
          total_marks: 100,
          percentage: 85,
          date: "2023-11-15",
          remarks: "Good performance",
        },
        {
          id: 2,
          subject: "Physics",
          exam_name: "Unit Test 1",
          exam_type: "internal",
          marks_obtained: 78,
          total_marks: 100,
          percentage: 78,
          date: "2023-11-10",
          remarks: "Needs improvement in mechanics",
        },
      ])
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/subjects/")
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

  const calculateStats = () => {
    let filteredMarks = marks
    if (selectedSubject !== "all") {
      filteredMarks = marks.filter((mark) => mark.subject === selectedSubject)
    }

    const totalExams = filteredMarks.length
    const averageMarks = totalExams > 0 ? filteredMarks.reduce((sum, mark) => sum + mark.percentage, 0) / totalExams : 0
    const highestMarks = totalExams > 0 ? Math.max(...filteredMarks.map((mark) => mark.percentage)) : 0

    const grade =
      averageMarks >= 90 ? "A+" : averageMarks >= 80 ? "A" : averageMarks >= 70 ? "B+" : averageMarks >= 60 ? "B" : "C"

    setOverallStats({
      totalExams,
      averageMarks: Math.round(averageMarks * 100) / 100,
      highestMarks,
      grade,
    })
  }

  const getGradeBadge = (percentage) => {
    if (percentage >= 90) return <Badge className="bg-green-500">A+</Badge>
    if (percentage >= 80) return <Badge className="bg-blue-500">A</Badge>
    if (percentage >= 70) return <Badge className="bg-yellow-500">B+</Badge>
    if (percentage >= 60) return <Badge className="bg-orange-500">B</Badge>
    return <Badge variant="destructive">C</Badge>
  }

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Marks & Results</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalExams}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.averageMarks}%</div>
                <Progress value={overallStats.averageMarks} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.highestMarks}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.grade}</div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Filter */}
          <Card>
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
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks
                    .filter((mark) => selectedSubject === "all" || mark.subject === selectedSubject)
                    .map((mark) => (
                      <TableRow key={mark.id}>
                        <TableCell className="font-medium">{mark.subject}</TableCell>
                        <TableCell>{mark.exam_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{mark.exam_type.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          {mark.marks_obtained}/{mark.total_marks}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getPerformanceColor(mark.percentage)}`}>
                            {mark.percentage}%
                          </span>
                        </TableCell>
                        <TableCell>{getGradeBadge(mark.percentage)}</TableCell>
                        <TableCell>{new Date(mark.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => {
                    const subjectMarks = marks.filter((mark) => mark.subject === subject.name)
                    const avgPercentage =
                      subjectMarks.length > 0
                        ? subjectMarks.reduce((sum, mark) => sum + mark.percentage, 0) / subjectMarks.length
                        : 0

                    return (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{subject.name}</span>
                          <span className="text-sm text-muted-foreground">{Math.round(avgPercentage)}%</span>
                        </div>
                        <Progress value={avgPercentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Performance chart will be displayed here</p>
                  <p className="text-sm text-gray-400">Integration with charting library required</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MarksResultView
