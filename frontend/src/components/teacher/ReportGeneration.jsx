"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react"

function ReportGeneration() {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    report_type: "",
    class_id: "",
    subject_id: "",
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

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

  const generateReport = async () => {
    setLoading(true)
    try {
      const response = await axios.post("http://localhost:8000/api/teacher/generate-report/", filters)
      setReportData(response.data)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (format) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/teacher/download-report/`,
        { ...filters, format },
        { responseType: "blob" },
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `report.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error downloading report:", error)
    }
  }

  const reportTypes = [
    { value: "attendance", label: "Attendance Report" },
    { value: "performance", label: "Performance Report" },
    { value: "assignment", label: "Assignment Report" },
    { value: "overall", label: "Overall Class Report" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Report Generation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="report_type">Report Type</Label>
              <Select
                value={filters.report_type}
                onValueChange={(value) => setFilters({ ...filters, report_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="class">Class</Label>
              <Select value={filters.class_id} onValueChange={(value) => setFilters({ ...filters, class_id: value })}>
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
                value={filters.subject_id}
                onValueChange={(value) => setFilters({ ...filters, subject_id: value })}
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
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              />
            </div>

            <Button onClick={generateReport} disabled={loading || !filters.report_type} className="w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              {loading ? "Generating..." : "Generate Report"}
            </Button>

            {reportData && (
              <div className="space-y-2">
                <Button onClick={() => downloadReport("pdf")} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => downloadReport("excel")} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Display */}
        <div className="lg:col-span-2">
          {reportData ? (
            <Tabs defaultValue="summary" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Students</span>
                          <span className="text-2xl font-bold">{reportData.summary?.total_students || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Average Attendance</span>
                          <span className="text-2xl font-bold">{reportData.summary?.avg_attendance || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Average Performance</span>
                          <span className="text-2xl font-bold">{reportData.summary?.avg_performance || 0}%</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Attendance Rate</span>
                            <span className="text-sm">{reportData.summary?.avg_attendance || 0}%</span>
                          </div>
                          <Progress value={reportData.summary?.avg_attendance || 0} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Performance Rate</span>
                            <span className="text-sm">{reportData.summary?.avg_performance || 0}%</span>
                          </div>
                          <Progress value={reportData.summary?.avg_performance || 0} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.details?.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{item.student_name}</h4>
                              <p className="text-sm text-gray-600">Roll No: {item.roll_number}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{item.value}%</p>
                              <p className="text-sm text-gray-600">{item.metric}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="charts">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Visual Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Charts and graphs will be displayed here</p>
                      <p className="text-sm text-gray-400">Integration with charting library required</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Select filters and generate a report to view results</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportGeneration
