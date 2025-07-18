from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()

# Authentication
router.register(r'auth', views.AuthViewSet, basename='auth')

# User Management
router.register(r'users', views.UserViewSet, basename='user')

# Academic Management
router.register(r'departments', views.DepartmentViewSet, basename='department')
router.register(r'classes', views.ClassViewSet, basename='class')
router.register(r'subjects', views.SubjectViewSet, basename='subject')
router.register(r'teachers', views.TeacherViewSet, basename='teacher')
router.register(r'students', views.StudentViewSet, basename='student')

# Schedule Management
router.register(r'schedules', views.ScheduleViewSet, basename='schedule')

# Attendance Management
router.register(r'attendance', views.AttendanceViewSet, basename='attendance')

# Examination & Results
router.register(r'examinations', views.ExaminationViewSet, basename='examination')
router.register(r'results', views.ResultViewSet, basename='result')

# Notice Board
router.register(r'notices', views.NoticeViewSet, basename='notice')

# Assignment Management
router.register(r'assignments', views.AssignmentViewSet, basename='assignment')
router.register(r'submissions', views.AssignmentSubmissionViewSet, basename='submission')

# Dashboard
router.register(r'dashboard', views.DashboardViewSet, basename='dashboard')

urlpatterns = [
    # API root
    path('', include(router.urls)),
    
    # JWT Token Refresh
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Custom endpoints
    path('attendance/mark/', views.mark_attendance, name='mark_attendance'),
    path('student/attendance/', views.student_attendance, name='student_attendance'),
    path('student/results/', views.student_results, name='student_results'),
    path('teacher/classes/', views.teacher_classes, name='teacher_classes'),
    
    # Include router URLs
    path('', include(router.urls)),
]
