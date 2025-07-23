"use client"
import { useAuth } from "../../contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import StudentOverview from "./StudentOverview"
import { useLocation } from "react-router-dom"

function StudentDashboard() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isOverview = location.pathname === "/student"

  return (
    <div className="min-h-screen bg-gray-50">
      {isOverview && (
        <StudentOverview />
      )}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Student Dashboard</h1>
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
                <CardTitle>Current GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.8</div>
                <p className="text-xs text-gray-500">Out of 4.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-gray-500">This semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-500">Due this week</p>
              </CardContent>
            </Card>
          </div>

          
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
