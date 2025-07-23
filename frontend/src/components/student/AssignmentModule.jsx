"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, Calendar, Clock, FileText, CheckCircle } from "lucide-react"

function AssignmentModule() {
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submissionForm, setSubmissionForm] = useState({
    submission_text: "",
    submission_file: null,
  })
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/assignments/")
      setAssignments(response.data)
    } catch (error) {
      console.error("Error fetching assignments:", error)
      // Demo data
      setAssignments([
        {
          id: 1,
          title: "Math Problem Set 1",
          description: "Solve the given calculus problems",
          subject: "Mathematics",
          assigned_date: "2023-11-01",
          due_date: "2023-11-15",
          total_marks: 50,
          is_submitted: false,
          submission_date: null,
          marks_obtained: null,
          feedback: null,
        },
        {
          id: 2,
          title: "Physics Lab Report",
          description: "Write a detailed lab report on pendulum experiment",
          subject: "Physics",
          assigned_date: "2023-10-25",
          due_date: "2023-11-10",
          total_marks: 30,
          is_submitted: true,
          submission_date: "2023-11-08",
          marks_obtained: 28,
          feedback: "Excellent work! Well structured report.",
        },
      ])
    }
  }

  const handleFileChange = (e) => {
    setSubmissionForm({
      ...submissionForm,
      submission_file: e.target.files[0],
    })
  }

  const handleSubmission = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("assignment_id", selectedAssignment.id)
      formData.append("submission_text", submissionForm.submission_text)
      if (submissionForm.submission_file) {
        formData.append("submission_file", submissionForm.submission_file)
      }

      await axios.post("http://localhost:8000/api/assignment-submissions/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      fetchAssignments()
      setIsSubmissionDialogOpen(false)
      setSubmissionForm({ submission_text: "", submission_file: null })
      alert("Assignment submitted successfully!")
    } catch (error) {
      console.error("Error submitting assignment:", error)
      alert("Error submitting assignment")
    }
  }

  const getStatusBadge = (assignment) => {
    const today = new Date()
    const dueDate = new Date(assignment.due_date)

    if (assignment.is_submitted) {
      return <Badge className="bg-green-500">Submitted</Badge>
    } else if (dueDate < today) {
      return <Badge variant="destructive">Overdue</Badge>
    } else {
      return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days left`
  }

  const pendingAssignments = assignments.filter((a) => !a.is_submitted)
  const submittedAssignments = assignments.filter((a) => a.is_submitted)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assignment Module</h1>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
          <TabsTrigger value="all">All Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingAssignments.map((assignment) => (
              <Card key={assignment.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    {getStatusBadge(assignment)}
                  </div>
                  <p className="text-sm text-gray-600">{assignment.subject}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{assignment.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span
                        className={`font-medium ${
                          getDaysRemaining(assignment.due_date).includes("Overdue")
                            ? "text-red-600"
                            : getDaysRemaining(assignment.due_date).includes("today")
                              ? "text-orange-600"
                              : "text-blue-600"
                        }`}
                      >
                        {getDaysRemaining(assignment.due_date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Marks: {assignment.total_marks}</span>
                    </div>
                  </div>

                  <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4" onClick={() => setSelectedAssignment(assignment)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Assignment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Submit Assignment: {selectedAssignment?.title}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmission} className="space-y-4">
                        <div>
                          <Label htmlFor="submission_text">Written Submission</Label>
                          <Textarea
                            id="submission_text"
                            value={submissionForm.submission_text}
                            onChange={(e) =>
                              setSubmissionForm({
                                ...submissionForm,
                                submission_text: e.target.value,
                              })
                            }
                            rows={6}
                            placeholder="Enter your written submission here..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="submission_file">Upload File (Optional)</Label>
                          <Input
                            id="submission_file"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt"
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, TXT</p>
                        </div>

                        <Button type="submit" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Assignment
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {pendingAssignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-gray-500">No pending assignments! Great job!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.subject}</TableCell>
                      <TableCell>
                        {assignment.submission_date ? new Date(assignment.submission_date).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        {assignment.marks_obtained !== null
                          ? `${assignment.marks_obtained}/${assignment.total_marks}`
                          : "Not graded"}
                      </TableCell>
                      <TableCell>
                        {assignment.marks_obtained !== null ? (
                          <Badge className="bg-green-500">Graded</Badge>
                        ) : (
                          <Badge variant="secondary">Under Review</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.subject}</TableCell>
                      <TableCell>{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>{assignment.total_marks}</TableCell>
                      <TableCell>{getStatusBadge(assignment)}</TableCell>
                      <TableCell>
                        {assignment.marks_obtained !== null
                          ? `${assignment.marks_obtained}/${assignment.total_marks}`
                          : "-"}
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

export default AssignmentModule
