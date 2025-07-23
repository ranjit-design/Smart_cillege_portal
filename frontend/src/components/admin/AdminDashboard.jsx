"use client"
import { useAuth } from "../../contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import StudentManagement from "./StudentManagement"
import TeacherManagement from "./TeacherManagement"
import ClassManagement from "./ClassManagement"
import ScheduleManagement from "./ScheduleManagement"
import ExaminationManagement from "./ExaminationManagement"
import NoticeManagement from "./NoticeManagement"
import AdminOverview from "./AdminOverview"
import { useState } from "react"

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [selectedTab, setSelectedTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
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
                <CardTitle>Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-gray-500">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-gray-500">+2 new classes</p>
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
                    onClick={() => setSelectedTab("overview")}
                  >
                    Dashboard Overview
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={() => setSelectedTab("students")}
                  >
                    Manage Students
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={() => setSelectedTab("teachers")}
                  >
                    Manage Teachers
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={() => setSelectedTab("classes")}
                  >
                    Manage Classes
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={() => setSelectedTab("schedules")}
                  >
                    Manage Schedule
                  </Button>
                   <Button 
                    className="h-20" 
                    onClick={() => setSelectedTab("examinations")}
                  >
                    Manage Examinations
                  </Button>
                   <Button 
                    className="h-20" 
                    onClick={() => setSelectedTab("notices")}
                  >
                    Upload Notices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedTab === "overview" && (
            <div className="mt-8">
              <AdminOverview />
            </div>
          )}
          {selectedTab === "students" && (
            <div className="mt-8">
              <StudentManagement />
            </div>
          )}
          {selectedTab === "teachers" && (
            <div className="mt-8">
              <TeacherManagement />
            </div>
          )}
          {selectedTab === "classes" && (
            <div className="mt-8">
              <ClassManagement />
            </div>
          )}
          {selectedTab === "schedules" && (
            <div className="mt-8">
              <ScheduleManagement />
            </div>
          )}
          {selectedTab === "examinations" && (
            <div className="mt-8">
              <ExaminationManagement />
            </div>
          )}
          {selectedTab === "notices" && (
            <div className="mt-8">
              <NoticeManagement />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
