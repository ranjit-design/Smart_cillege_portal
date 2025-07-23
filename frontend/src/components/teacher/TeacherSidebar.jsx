"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  FileText,
  MessageSquare,
  Calendar,
  BarChart3,
  Star,
  LogOut,
} from "lucide-react"

function TeacherSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { path: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/attendance", icon: ClipboardCheck, label: "Attendance" },
    { path: "/teacher/marks", icon: GraduationCap, label: "Marks Entry" },
    { path: "/teacher/assignments", icon: FileText, label: "Assignments" },
    { path: "/teacher/communication", icon: MessageSquare, label: "Communication" },
    { path: "/teacher/schedule", icon: Calendar, label: "Schedule" },
    { path: "/teacher/reports", icon: BarChart3, label: "Reports" },
    { path: "/teacher/feedback", icon: Star, label: "Feedback" },
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Teacher Panel</h2>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? "bg-blue-50 border-r-4 border-blue-500" : ""
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>

    
    </div>
  )
}

export default TeacherSidebar
