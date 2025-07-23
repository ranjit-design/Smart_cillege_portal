"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Send, MessageSquare, User } from "lucide-react"

function FeedbackSubmission() {
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [feedbackForm, setFeedbackForm] = useState({
    feedback_type: "student_to_teacher",
    to_teacher_id: "",
    subject_id: "",
    rating: "",
    comments: "",
  })

  useEffect(() => {
    fetchTeachers()
    fetchSubjects()
    fetchFeedbacks()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/teachers/")
      setTeachers(response.data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      // Demo data
      setTeachers([
        { id: 1, name: "Dr. Smith", subject: "Mathematics" },
        { id: 2, name: "Prof. Johnson", subject: "Physics" },
        { id: 3, name: "Dr. Brown", subject: "Chemistry" },
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

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/feedbacks/")
      setFeedbacks(response.data)
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      // Demo data
      setFeedbacks([
        {
          id: 1,
          feedback_type: "student_to_teacher",
          to_user_name: "Dr. Smith",
          subject_name: "Mathematics",
          rating: 5,
          comments: "Excellent teaching method and very helpful",
          created_at: "2023-11-10",
        },
        {
          id: 2,
          feedback_type: "student_to_admin",
          to_user_name: "Admin",
          subject_name: null,
          rating: 4,
          comments: "Good facilities but library hours could be extended",
          created_at: "2023-11-05",
        },
      ])
    }
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/api/feedback/", feedbackForm)

      setFeedbackForm({
        feedback_type: "student_to_teacher",
        to_teacher_id: "",
        subject_id: "",
        rating: "",
        comments: "",
      })

      fetchFeedbacks()
      alert("Feedback submitted successfully!")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Error submitting feedback")
    }
  }

  const getRatingStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => onRatingChange(index + 1) : undefined}
      />
    ))
  }

  const getFeedbackTypeBadge = (type) => {
    const variants = {
      student_to_teacher: "default",
      student_to_admin: "secondary",
    }
    const labels = {
      student_to_teacher: "Teacher Feedback",
      student_to_admin: "Admin Feedback",
    }
    return <Badge variant={variants[type]}>{labels[type]}</Badge>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback Submission</h1>

      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="history">Feedback History</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teacher Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Teacher Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <input
                    type="hidden"
                    value="student_to_teacher"
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback_type: e.target.value })}
                  />

                  <div>
                    <Label htmlFor="teacher">Select Teacher</Label>
                    <Select
                      value={feedbackForm.to_teacher_id}
                      onValueChange={(value) => setFeedbackForm({ ...feedbackForm, to_teacher_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name} - {teacher.subject}
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
                    <Label>Rating</Label>
                    <div className="flex items-center space-x-1 mt-2">
                      {getRatingStars(Number.parseInt(feedbackForm.rating) || 0, true, (rating) =>
                        setFeedbackForm({ ...feedbackForm, rating: rating.toString() }),
                      )}
                      <span className="ml-2 text-sm text-gray-600">
                        {feedbackForm.rating ? `${feedbackForm.rating}/5` : "Select rating"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={feedbackForm.comments}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                      rows={4}
                      placeholder="Share your feedback about the teacher..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Teacher Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Admin Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  General Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const adminFeedback = {
                      ...feedbackForm,
                      feedback_type: "student_to_admin",
                      to_teacher_id: "",
                      subject_id: "",
                    }
                    setFeedbackForm(adminFeedback)
                    handleSubmitFeedback(e)
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center space-x-1 mt-2">
                      {getRatingStars(Number.parseInt(feedbackForm.rating) || 0, true, (rating) =>
                        setFeedbackForm({ ...feedbackForm, rating: rating.toString() }),
                      )}
                      <span className="ml-2 text-sm text-gray-600">
                        {feedbackForm.rating ? `${feedbackForm.rating}/5` : "Select rating"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="admin-comments">Comments</Label>
                    <Textarea
                      id="admin-comments"
                      value={feedbackForm.comments}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                      rows={6}
                      placeholder="Share your feedback about college facilities, administration, or general suggestions..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit General Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Feedback Options */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Feedback Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <Star className="w-6 h-6 mb-2 text-yellow-500" />
                  <span className="text-sm">Teaching Quality</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <MessageSquare className="w-6 h-6 mb-2 text-blue-500" />
                  <span className="text-sm">Course Content</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <User className="w-6 h-6 mb-2 text-green-500" />
                  <span className="text-sm">Support & Help</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <Star className="w-6 h-6 mb-2 text-purple-500" />
                  <span className="text-sm">Facilities</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Feedback History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>{getFeedbackTypeBadge(feedback.feedback_type)}</TableCell>
                      <TableCell>{feedback.to_user_name}</TableCell>
                      <TableCell>{feedback.subject_name || "General"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">{getRatingStars(feedback.rating)}</div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{feedback.comments}</p>
                      </TableCell>
                      <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {feedbacks.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No feedback submitted yet</p>
                  <p className="text-sm text-gray-400">Your feedback helps improve the learning experience</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FeedbackSubmission
