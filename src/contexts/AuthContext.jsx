"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      // Validate the stored user data
      if (userData && userData.username && userData.role && userData.name) {
        setUser(userData)
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    setLoading(true)

    // Demo authentication
    const users = {
      admin: { username: "admin", password: "admin", role: "admin", name: "Admin User" },
      teacher: { username: "teacher", password: "teacher", role: "teacher", name: "Teacher User" },
      student: { username: "student", password: "student", role: "student", name: "Student User" },
    }

    const user = users[username]

    if (user && user.password === password) {
      const userData = { 
        username: user.username, 
        role: user.role, 
        name: user.name,
        email: `${user.username}@smartcollege.edu`
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      setLoading(false)
      return { success: true, user: userData }
    } else {
      setLoading(false)
      return { success: false, error: "Invalid username or password" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // For backward compatibility with components that might use these properties
  const value = {
    user,
    currentUser: user, // Alias for user
    userRole: user?.role, // Direct access to role
    login,
    logout,
    loading,
    isAuthenticated: !!user, // Add this to make it more explicit
  }

  return <AuthContext.Provider value={value}>{
    loading ? <div className="min-h-screen flex items-center justify-center">Loading...</div> : children
  }</AuthContext.Provider>
}
