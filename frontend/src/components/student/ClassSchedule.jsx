"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, BookOpen, User } from "lucide-react"

function ClassSchedule() {
  const [schedule, setSchedule] = useState([])
  const [todayClasses, setTodayClasses] = useState([])
  const [weeklySchedule, setWeeklySchedule] = useState({})

  useEffect(() => {
    fetchSchedule()
    fetchTodayClasses()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/schedule/")
      setSchedule(response.data)
      organizeWeeklySchedule(response.data)
    } catch (error) {
      console.error("Error fetching schedule:", error)
      // Demo data
      const demoSchedule = [
        {
          id: 1,
          subject_name: "Mathematics",
          teacher_name: "Dr. Smith",
          day_of_week: "monday",
          start_time: "09:00",
          end_time: "10:30",
          room_number: "101",
        },
        {
          id: 2,
          subject_name: "Physics",
          teacher_name: "Prof. Johnson",
          day_of_week: "monday",
          start_time: "11:00",
          end_time: "12:30",
          room_number: "203",
        },
        {
          id: 3,
          subject_name: "Chemistry",
          teacher_name: "Dr. Brown",
          day_of_week: "tuesday",
          start_time: "09:00",
          end_time: "10:30",
          room_number: "301",
        },
      ]
      setSchedule(demoSchedule)
      organizeWeeklySchedule(demoSchedule)
    }
  }

  const fetchTodayClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/today-classes/")
      setTodayClasses(response.data)
    } catch (error) {
      console.error("Error fetching today's classes:", error)
      // Demo data for today (assuming it's Monday)
      setTodayClasses([
        {
          id: 1,
          subject_name: "Mathematics",
          teacher_name: "Dr. Smith",
          start_time: "09:00",
          end_time: "10:30",
          room_number: "101",
          status: "upcoming",
        },
        {
          id: 2,
          subject_name: "Physics",
          teacher_name: "Prof. Johnson",
          start_time: "11:00",
          end_time: "12:30",
          room_number: "203",
          status: "upcoming",
        },
      ])
    }
  }

  const organizeWeeklySchedule = (scheduleData) => {
    const organized = {}
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

    days.forEach((day) => {
      organized[day] = scheduleData
        .filter((item) => item.day_of_week === day)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
    })

    setWeeklySchedule(organized)
  }

  const getTimeStatus = (startTime, endTime) => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)

    if (currentTime < startTime) {
      return { status: "upcoming", variant: "secondary" }
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return { status: "ongoing", variant: "default" }
    } else {
      return { status: "completed", variant: "outline" }
    }
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
  }

  const getCurrentDay = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[new Date().getDay()]
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Class Schedule</h1>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">Today's Classes</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Schedule - {dayNames[getCurrentDay()]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayClasses.length > 0 ? (
                <div className="space-y-4">
                  {todayClasses.map((classItem) => {
                    const timeStatus = getTimeStatus(classItem.start_time, classItem.end_time)
                    return (
                      <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-center">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium">
                              {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{classItem.subject_name}</h3>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <User className="w-4 h-4 mr-1" />
                              <span>{classItem.teacher_name}</span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>Room {classItem.room_number}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={timeStatus.variant}>{timeStatus.status}</Badge>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No classes scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(weeklySchedule).map(([day, classes]) => (
              <Card key={day} className={getCurrentDay() === day ? "ring-2 ring-blue-500" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    {dayNames[day]}
                    {getCurrentDay() === day && (
                      <Badge variant="default" className="ml-2">
                        Today
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {classes.length > 0 ? (
                    <div className="space-y-3">
                      {classes.map((classItem) => (
                        <div key={classItem.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{classItem.subject_name}</h4>
                            <span className="text-xs text-gray-500">
                              {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <User className="w-3 h-3 mr-1" />
                              <span>{classItem.teacher_name}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>Room {classItem.room_number}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No classes scheduled</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ClassSchedule
