"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, Target, Brain, AlertTriangle } from "lucide-react"

function PerformancePrediction() {
  const [predictionData, setPredictionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictionData()
  }, [])

  const fetchPredictionData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/performance/")
      setPredictionData(response.data)
    } catch (error) {
      console.error("Error fetching prediction data:", error)
      // Demo data
      setPredictionData({
        current_average: 78.5,
        trend: "improving",
        predictions: [82, 85, 87],
        recommendation: "Good progress! Continue with current study approach.",
        risk_subjects: [
          { subject: "Physics", current_avg: 65, predicted: 68, risk_level: "medium" },
          { subject: "Chemistry", current_avg: 58, predicted: 62, risk_level: "high" },
        ],
        strengths: [
          { subject: "Mathematics", current_avg: 92, predicted: 94, trend: "stable" },
          { subject: "English", current_avg: 88, predicted: 90, trend: "improving" },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case "declining":
        return <TrendingDown className="w-5 h-5 text-red-500" />
      default:
        return <Target className="w-5 h-5 text-blue-500" />
    }
  }

  const getTrendBadge = (trend) => {
    const variants = {
      improving: "default",
      declining: "destructive",
      stable: "secondary",
    }
    return <Badge variant={variants[trend]}>{trend}</Badge>
  }

  const getRiskBadge = (riskLevel) => {
    const variants = {
      low: "default",
      medium: "secondary",
      high: "destructive",
    }
    return <Badge variant={variants[riskLevel]}>{riskLevel} risk</Badge>
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!predictionData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Insufficient data for performance prediction. Complete more assessments to see predictions.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Performance Prediction</h1>

      {/* Current Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Average</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictionData.current_average}%</div>
            <Progress value={predictionData.current_average} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Trend</CardTitle>
            {getTrendIcon(predictionData.trend)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">{getTrendBadge(predictionData.trend)}</div>
            <p className="text-xs text-muted-foreground mt-2">Based on recent performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Next Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {predictionData.predictions && predictionData.predictions[0]
                ? `${predictionData.predictions[0]}%`
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription className="text-base">{predictionData.recommendation}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Subjects Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictionData.risk_subjects && predictionData.risk_subjects.length > 0 ? (
                predictionData.risk_subjects.map((subject, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{subject.subject}</h4>
                      {getRiskBadge(subject.risk_level)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Average:</span>
                        <span className="font-medium">{subject.current_avg}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Predicted Score:</span>
                        <span className="font-medium text-blue-600">{subject.predicted}%</span>
                      </div>
                      <Progress value={subject.current_avg} className="mt-2" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No subjects at risk currently</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Strong Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Strong Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictionData.strengths && predictionData.strengths.length > 0 ? (
                predictionData.strengths.map((subject, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{subject.subject}</h4>
                      {getTrendBadge(subject.trend)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Average:</span>
                        <span className="font-medium">{subject.current_avg}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Predicted Score:</span>
                        <span className="font-medium text-green-600">{subject.predicted}%</span>
                      </div>
                      <Progress value={subject.current_avg} className="mt-2" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Keep working to build strengths</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future Predictions */}
      {predictionData.predictions && predictionData.predictions.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Future Performance Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictionData.predictions.map((prediction, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium text-sm text-gray-600">
                    Next {index + 1} Exam{index > 0 ? "s" : ""}
                  </h4>
                  <div className="text-2xl font-bold mt-2">{prediction}%</div>
                  <Progress value={prediction} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PerformancePrediction
