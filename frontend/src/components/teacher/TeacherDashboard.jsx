"use client"
import { useAuth } from "../../contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import AttendanceManagement from "./AttendanceManagement"
import AssignmentManagement from "./AssignmentManagement"
import MarksEntry from "./MarksEntry"
import CommunicationTools from "./CommunicationTools"
import ReportGeneration from "./ReportGeneration"
import ScheduleManagement from "./ScheduleManagement"
import FeedbackGeneration from "./FeedbackGeneration"
import { useState } from "react"

function TeacherDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("overview")

  const handleTakeAttendance = () => {
    setSelectedTab("attendance")
  }

  const handleGradeAssignments = () => {
    setSelectedTab("assignments")
  }

  const handleCreateAssignment = () => {
    navigate("/teacher/assignments/create")
  }

  const handleMarksEntry = () => {
    setSelectedTab("marks")
  }

  const handleCommunication = () => {
    setSelectedTab("communication")
  }

  const handleReports = () => {
    setSelectedTab("reports")
  }

  const handleViewSchedule = () => {
    setSelectedTab("schedule")
  }

  const handleFeedback = () => {
    setSelectedTab("feedback")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user?.name}</span>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-gray-500">Active classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">180</div>
                <p className="text-xs text-gray-500">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">To be graded</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    className="h-20" 
                    onClick={handleTakeAttendance}
                  >
                    Take Attendance
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={handleGradeAssignments}
                  >
                    Create Assignments
                  </Button>
                  
                  <Button 
                    className="h-20" 
                    onClick={handleMarksEntry}
                  >
                    Marks Entry
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={handleCommunication}
                  >
                    Communication
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={handleReports}
                  >
                    Reports
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={handleViewSchedule}
                  >
                    View Schedule
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={handleFeedback}
                  >
                    Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {selectedTab === "attendance" && <AttendanceManagement />}
            {selectedTab === "assignments" && <AssignmentManagement />}
            {selectedTab === "marks" && <MarksEntry />}
            {selectedTab === "communication" && <CommunicationTools />}
            {selectedTab === "reports" && <ReportGeneration />}
            {selectedTab === "schedule" && <ScheduleManagement />}
            {selectedTab === "feedback" && <FeedbackGeneration />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeacherDashboard
