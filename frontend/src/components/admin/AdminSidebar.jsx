"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  Bell,
  LogOut,
  LayoutDashboard,
  GraduationCap,
} from "lucide-react"

function AdminSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/classes", icon: GraduationCap, label: "Classes" },
    { path: "/admin/subjects", icon: BookOpen, label: "Subjects" },
    { path: "/admin/teachers", icon: Users, label: "Teachers" },
    { path: "/admin/schedule", icon: Calendar, label: "Schedule" },
    { path: "/admin/attendance", icon: ClipboardCheck, label: "Attendance" },
    { path: "/admin/examinations", icon: FileText, label: "Examinations" },
    { path: "/admin/notices", icon: Bell, label: "Notices" },
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
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

export default AdminSidebar
