// "use client"

import {useState,useEffect} from "react";
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, ClipboardCheck, FileText, Calendar, TrendingUp, Clock, AlertCircle } from "lucide-react"

function TeacherOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    pendingAssignments: 0,
    todayClasses: 0,
    attendanceRate: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse, classesResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/teacher/stats/"),
        axios.get("http://localhost:8000/api/teacher/recent-activities/"),
        axios.get("http://localhost:8000/api/teacher/upcoming-classes/"),
      ])

      setStats(statsResponse.data)
      setRecentActivities(activitiesResponse.data)
      setUpcomingClasses(classesResponse.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
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
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Teaching</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">Teaching subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayClasses}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Overall Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Rate</span>
                <span className="text-sm text-muted-foreground">{stats.attendanceRate}%</span>
              </div>
              <Progress value={stats.attendanceRate} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Assignments to Grade</span>
                <Badge variant="secondary">{stats.pendingAssignments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance to Mark</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reports to Generate</span>
                <Badge variant="secondary">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((classItem, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{classItem.subject}</p>
                      <p className="text-sm text-gray-600">
                        {classItem.class_name} - {classItem.room}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{classItem.time}</p>
                      <Badge variant="outline">{classItem.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming classes today</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
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

export default TeacherOverview
