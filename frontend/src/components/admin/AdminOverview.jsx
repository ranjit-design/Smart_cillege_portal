"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react"

function AdminOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    overallAttendance: 0,
    activeNotices: 0,
    pendingExams: 0,
    systemHealth: 95,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse, alertsResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/stats/"),
        axios.get("http://localhost:8000/api/admin/recent-activities/"),
        axios.get("http://localhost:8000/api/admin/alerts/"),
      ])

      setStats(statsResponse.data)
      setRecentActivities(activitiesResponse.data)
      setAlerts(alertsResponse.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Set demo data
      setStats({
        totalStudents: 1250,
        totalTeachers: 85,
        totalClasses: 24,
        totalSubjects: 18,
        overallAttendance: 87,
        activeNotices: 5,
        pendingExams: 3,
        systemHealth: 95,
      })
      setRecentActivities([
        {
          id: 1,
          description: "New student enrolled in Computer Science",
          timestamp: "2 hours ago",
          type: "enrollment",
        },
        { id: 2, description: "Teacher John Smith updated marks for Math", timestamp: "4 hours ago", type: "marks" },
        { id: 3, description: "New notice published for all students", timestamp: "1 day ago", type: "notice" },
      ])
      setAlerts([
        { id: 1, message: "Low attendance in Class 10-A", severity: "warning" },
        { id: 2, message: "Exam schedule needs approval", severity: "info" },
        { id: 3, message: "Server maintenance scheduled", severity: "info" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getAlertBadge = (severity) => {
    const variants = {
      warning: "destructive",
      info: "default",
      success: "secondary",
    }
    return <Badge variant={variants[severity]}>{severity}</Badge>
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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

   
  
}

export default AdminOverview
