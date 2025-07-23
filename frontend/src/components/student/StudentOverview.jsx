"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ClipboardCheck, TrendingUp, Calendar, FileText, Clock, Award } from "lucide-react"

function StudentOverview() {
  const [stats, setStats] = useState({
    overallAttendance: 0,
    averageMarks: 0,
    totalSubjects: 0,
    pendingAssignments: 0,
    upcomingExams: 0,
    recentGrade: "A",
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse, eventsResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/student/dashboard-stats/"),
        axios.get("http://localhost:8000/api/student/recent-activities/"),
        axios.get("http://localhost:8000/api/student/upcoming-events/"),
      ])

      setStats(statsResponse.data)
      setRecentActivities(activitiesResponse.data)
      setUpcomingEvents(eventsResponse.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Set default data for demo
      setStats({
        overallAttendance: 85,
        averageMarks: 78,
        totalSubjects: 6,
        pendingAssignments: 3,
        upcomingExams: 2,
        recentGrade: "B+",
      })
      setRecentActivities([
        { id: 1, description: "Submitted Math Assignment", timestamp: "2 hours ago" },
        { id: 2, description: "Attended Physics Class", timestamp: "1 day ago" },
        { id: 3, description: "Received feedback on English Essay", timestamp: "2 days ago" },
      ])
      setUpcomingEvents([
        { id: 1, title: "Math Quiz", date: "Tomorrow", type: "exam" },
        { id: 2, title: "Science Project Due", date: "Dec 15", type: "assignment" },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overallAttendance}%</div>
            <Progress value={stats.overallAttendance} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overallAttendance >= 75 ? "Good standing" : "Below requirement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageMarks}%</div>
            <div className="flex items-center mt-2">
              <Award className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Grade: {stats.recentGrade}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">Enrolled this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">Assignments due</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                    <Badge variant={event.type === "exam" ? "destructive" : "default"}>{event.type}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StudentOverview
