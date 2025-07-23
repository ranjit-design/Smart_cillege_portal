"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

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
  const [access, setAccess] = useState(null)
  const [refresh, setRefresh] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    const savedAccess = localStorage.getItem("access")
    const savedRefresh = localStorage.getItem("refresh")
    if (savedUser && savedAccess && savedRefresh) {
      const userData = JSON.parse(savedUser)
      // Validate the stored user data
      if (userData && userData.username && userData.role && userData.name) {
        setUser(userData)
        setAccess(savedAccess)
        setRefresh(savedRefresh)
      }
    }
    setLoading(false)
  }, [])

  // Helper to set all auth data
  const setAuth = (data) => {
    setUser(data.user)
    setAccess(data.access)
    setRefresh(data.refresh)
    localStorage.setItem("user", JSON.stringify(data.user))
    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)
  }

  // Login function: calls backend API
  const login = async (username, password) => {
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setLoading(false)
        return { success: false, error: data.error || "Invalid credentials" }
      }
      const data = await response.json()
      setAuth(data)
      setLoading(false)
      return { success: true, user: data.user }
    } catch (err) {
      setLoading(false)
      return { success: false, error: "Network error" }
    }
  }

  const logout = useCallback(() => {
    setUser(null)
    setAccess(null)
    setRefresh(null)
    localStorage.removeItem("user")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
  }, [])

  // Token refresh logic
  const refreshToken = useCallback(async () => {
    if (!refresh) return false
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh })
      })
      if (!response.ok) throw new Error("Refresh failed")
      const data = await response.json()
      setAccess(data.access)
      localStorage.setItem("access", data.access)
      return true
    } catch {
      logout()
      return false
    }
  }, [refresh, logout])

  const value = {
    user,
    currentUser: user,
    userRole: user?.role,
    access,
    refresh,
    login,
    logout,
    refreshToken,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
