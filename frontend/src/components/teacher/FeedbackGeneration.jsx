"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Star, Send, MessageSquare, TrendingUp } from "lucide-react"

function FeedbackGeneration() {
  const [students, setStudents] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [feedbackForm, setFeedbackForm] = useState({
    student_id: "",
    subject_id: "",
    rating: "",
    comments: "",
    feedback_type: "teacher_to_student",
  })

  useEffect(() => {
    fetchStudents()
    fetchFeedbacks()
    fetchSubjects()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/students/")
      setStudents(response.data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/feedbacks/")
      setFeedbacks(response.data)
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
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

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/api/feedback/", feedbackForm)
      setFeedbackForm({
        student_id: "",
        subject_id: "",
        rating: "",
        comments: "",
        feedback_type: "teacher_to_student",
      })
      fetchFeedbacks()
      alert("Feedback submitted successfully!")
    } catch (error) {
      console.error("Error submitting feedback:", error)
    }
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getFeedbackTypeBadge = (type) => {
    const variants = {
      teacher_to_student: "default",
      student_to_teacher: "secondary",
      student_to_admin: "outline",
    }
    return <Badge variant={variants[type]}>{type.replace(/_/g, " ").toUpperCase()}</Badge>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback Generation</h1>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Feedback</TabsTrigger>
          <TabsTrigger value="history">Feedback History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Create Student Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div>
                    <Label htmlFor="student">Student</Label>
                    <Select
                      value={feedbackForm.student_id}
                      onValueChange={(value) => setFeedbackForm({ ...feedbackForm, student_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.first_name} {student.last_name} ({student.roll_number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={feedbackForm.subject_id}
                      onValueChange={(value) => setFeedbackForm({ ...feedbackForm, subject_id: value })}
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
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Select
                      value={feedbackForm.rating}
                      onValueChange={(value) => setFeedbackForm({ ...feedbackForm, rating: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center">
                              {getRatingStars(rating)}
                              <span className="ml-2">({rating})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={feedbackForm.comments}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                      rows={4}
                      placeholder="Enter detailed feedback..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Feedback Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Feedback Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <h4 className="font-medium">Excellent Performance</h4>
                    <p className="text-sm text-gray-600">
                      Outstanding work! Keep up the excellent performance and continue to excel.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <h4 className="font-medium">Good Progress</h4>
                    <p className="text-sm text-gray-600">
                      Good improvement shown. Continue working hard to achieve better results.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <h4 className="font-medium">Needs Improvement</h4>
                    <p className="text-sm text-gray-600">
                      More effort required. Please focus on weak areas and seek help when needed.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <h4 className="font-medium">Attendance Concern</h4>
                    <p className="text-sm text-gray-600">
                      Regular attendance is crucial for academic success. Please improve attendance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>{feedback.to_user_name || feedback.from_user_name}</TableCell>
                      <TableCell>{feedback.subject_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">{getRatingStars(feedback.rating)}</div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{feedback.comments}</TableCell>
                      <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{getFeedbackTypeBadge(feedback.feedback_type)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbacks.length}</div>
                <p className="text-xs text-muted-foreground">Given this semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedbacks.length > 0
                    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                    : "0.0"}
                </div>
                <p className="text-xs text-muted-foreground">Out of 5.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Student engagement</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = feedbacks.filter((f) => f.rating === rating).length
                  const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center space-x-4">
                      <div className="flex items-center w-20">{getRatingStars(rating)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{rating} Stars</span>
                          <span className="text-sm text-gray-500">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FeedbackGeneration
