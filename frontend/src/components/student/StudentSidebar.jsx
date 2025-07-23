"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  TrendingUp,
  FileText,
  Calendar,
  Bell,
  MessageCircle,
  Download,
  Star,
  LogOut,
} from "lucide-react"

function StudentSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { path: "/student", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/attendance", icon: ClipboardCheck, label: "Attendance" },
    { path: "/student/marks", icon: GraduationCap, label: "Marks & Results" },
    { path: "/student/performance", icon: TrendingUp, label: "Performance" },
    { path: "/student/assignments", icon: FileText, label: "Assignments" },
    { path: "/student/schedule", icon: Calendar, label: "Schedule" },
    { path: "/student/notifications", icon: Bell, label: "Notifications" },
    { path: "/student/chat", icon: MessageCircle, label: "Chat/Support" },
    { path: "/student/downloads", icon: Download, label: "Downloads" },
    { path: "/student/feedback", icon: Star, label: "Feedback" },
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Student Portal</h2>
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

export default StudentSidebar
