"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Search, FileText, BookOpen, File } from "lucide-react"

function DownloadCenter() {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    fetchResources()
    fetchSubjects()
  }, [])

  useEffect(() => {
    filterResources()
  }, [resources, searchTerm, selectedType, selectedSubject])

  const fetchResources = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/downloadable-resources/")
      setResources(response.data)
    } catch (error) {
      console.error("Error fetching resources:", error)
      // Demo data
      const demoResources = [
        {
          id: 1,
          title: "Mathematics Syllabus 2023-24",
          description: "Complete syllabus for Mathematics course",
          resource_type: "syllabus",
          subject_name: "Mathematics",
          uploaded_by_name: "Dr. Smith",
          upload_date: "2023-09-01",
          file_size: "2.5 MB",
          file_extension: "pdf",
        },
        {
          id: 2,
          title: "Physics Lab Manual",
          description: "Laboratory manual for Physics experiments",
          resource_type: "notes",
          subject_name: "Physics",
          uploaded_by_name: "Prof. Johnson",
          upload_date: "2023-09-15",
          file_size: "5.2 MB",
          file_extension: "pdf",
        },
        {
          id: 3,
          title: "Chemistry Previous Year Papers",
          description: "Collection of previous year question papers",
          resource_type: "previous_papers",
          subject_name: "Chemistry",
          uploaded_by_name: "Dr. Brown",
          upload_date: "2023-10-01",
          file_size: "8.1 MB",
          file_extension: "zip",
        },
        {
          id: 4,
          title: "English Literature Notes",
          description: "Comprehensive notes on English Literature",
          resource_type: "notes",
          subject_name: "English",
          uploaded_by_name: "Ms. Davis",
          upload_date: "2023-10-15",
          file_size: "3.7 MB",
          file_extension: "docx",
        },
      ]
      setResources(demoResources)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/subjects/")
      setSubjects(response.data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
      setSubjects([
        { id: 1, name: "Mathematics" },
        { id: 2, name: "Physics" },
        { id: 3, name: "Chemistry" },
        { id: 4, name: "English" },
      ])
    }
  }

  const filterResources = () => {
    let filtered = resources

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.resource_type === selectedType)
    }

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter((resource) => resource.subject_name === selectedSubject)
    }

    setFilteredResources(filtered)
  }

  const downloadResource = async (resourceId, title) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/download-resource/${resourceId}/`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", title)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error downloading resource:", error)
      alert("Error downloading file")
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case "syllabus":
        return <BookOpen className="w-5 h-5 text-blue-500" />
      case "notes":
        return <FileText className="w-5 h-5 text-green-500" />
      case "previous_papers":
        return <File className="w-5 h-5 text-orange-500" />
      case "assignments":
        return <FileText className="w-5 h-5 text-purple-500" />
      default:
        return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeBadge = (type) => {
    const variants = {
      syllabus: "default",
      notes: "secondary",
      previous_papers: "outline",
      assignments: "destructive",
      other: "secondary",
    }
    return <Badge variant={variants[type]}>{type.replace("_", " ")}</Badge>
  }

  const resourceTypes = [
    { value: "syllabus", label: "Syllabus" },
    { value: "notes", label: "Notes" },
    { value: "previous_papers", label: "Previous Papers" },
    { value: "assignments", label: "Assignments" },
    { value: "other", label: "Other" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Download Center</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedType("all")
                setSelectedSubject("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Resources ({filteredResources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="flex items-start space-x-3">
                      {getResourceIcon(resource.resource_type)}
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(resource.resource_type)}</TableCell>
                  <TableCell>{resource.subject_name}</TableCell>
                  <TableCell>{resource.uploaded_by_name}</TableCell>
                  <TableCell>{new Date(resource.upload_date).toLocaleDateString()}</TableCell>
                  <TableCell>{resource.file_size}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => downloadResource(resource.id, resource.title)}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No resources found</p>
              <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DownloadCenter
