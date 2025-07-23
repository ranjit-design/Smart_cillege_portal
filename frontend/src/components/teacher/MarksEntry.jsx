"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Textarea } from "../../components/ui/textarea"
import { Save } from "lucide-react"

function MarksEntry() {
  const [examinations, setExaminations] = useState([])
  const [students, setStudents] = useState([])
  const [selectedExam, setSelectedExam] = useState("")
  const [marksData, setMarksData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExaminations()
  }, [])

  useEffect(() => {
    if (selectedExam) {
      fetchStudentsForExam()
    }
  }, [selectedExam])

  const fetchExaminations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/teacher/examinations/")
      setExaminations(response.data)
    } catch (error) {
      console.error("Error fetching examinations:", error)
    }
  }

  const fetchStudentsForExam = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/teacher/exam-students/${selectedExam}/`)
      setStudents(response.data)

      // Initialize marks data
      const initialMarks = {}
      response.data.forEach((student) => {
        initialMarks[student.id] = {
          marks_obtained: student.existing_marks || "",
          remarks: student.existing_remarks || "",
        }
      })
      setMarksData(initialMarks)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleMarksChange = (studentId, field, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const marksArray = Object.entries(marksData).map(([studentId, data]) => ({
        student_id: Number.parseInt(studentId),
        marks_obtained: Number.parseFloat(data.marks_obtained) || 0,
        remarks: data.remarks,
      }))

      await axios.post("http://localhost:8000/api/marks/entry/", {
        examination_id: selectedExam,
        marks_data: marksArray,
      })

      alert("Marks saved successfully!")
    } catch (error) {
      console.error("Error saving marks:", error)
      alert("Error saving marks")
    } finally {
      setLoading(false)
    }
  }

  const selectedExamDetails = examinations.find((exam) => exam.id.toString() === selectedExam)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Internal Marks Entry</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Examination</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an examination" />
              </SelectTrigger>
              <SelectContent>
                {examinations.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id.toString()}>
                    {exam.name} - {exam.subject_name} ({exam.exam_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedExamDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Examination Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Subject:</Label>
                  <p className="text-sm">{selectedExamDetails.subject_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Marks:</Label>
                  <p className="text-sm">{selectedExamDetails.total_marks}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date:</Label>
                  <p className="text-sm">{new Date(selectedExamDetails.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type:</Label>
                  <p className="text-sm capitalize">{selectedExamDetails.exam_type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {students.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Enter Marks</CardTitle>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Marks"}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Marks Obtained</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const marks = Number.parseFloat(marksData[student.id]?.marks_obtained) || 0
                  const percentage = selectedExamDetails
                    ? ((marks / selectedExamDetails.total_marks) * 100).toFixed(2)
                    : 0

                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>
                        {student.first_name} {student.last_name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={selectedExamDetails?.total_marks || 100}
                          value={marksData[student.id]?.marks_obtained || ""}
                          onChange={(e) => handleMarksChange(student.id, "marks_obtained", e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${percentage >= 60 ? "text-green-600" : "text-red-600"}`}>
                          {percentage}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={marksData[student.id]?.remarks || ""}
                          onChange={(e) => handleMarksChange(student.id, "remarks", e.target.value)}
                          placeholder="Optional remarks"
                          className="min-h-[60px]"
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MarksEntry
