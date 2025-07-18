from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'classes', views.ClassViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'teachers', views.TeacherViewSet)
router.register(r'students', views.StudentViewSet)
router.register(r'schedules', views.ScheduleViewSet)
router.register(r'examinations', views.ExaminationViewSet)
router.register(r'notices', views.NoticeViewSet)

urlpatterns = [
    # Authentication
    path('auth/login/', views.login_view, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', views.user_profile, name='user_profile'),
    
    # Admin and general endpoints
    path('', include(router.urls)),
    
    # Teacher specific endpoints
    path('teacher/classes/', views.teacher_classes, name='teacher_classes'),
    path('attendance/', views.mark_attendance, name='mark_attendance'),
    path('marks/entry/', views.enter_marks, name='enter_marks'),
    
    # Student specific endpoints
    path('student/attendance/', views.student_attendance, name='student_attendance'),
    path('student/marks/', views.student_marks, name='student_marks'),
    path('student/performance/', views.performance_prediction, name='performance_prediction'),
    path('student/assignments/', views.student_assignments, name='student_assignments'),
    path('student/schedule/', views.student_schedule, name='student_schedule'),
    path('student/notifications/', views.student_notifications, name='student_notifications'),
    path('student/subjects/', views.student_subjects, name='student_subjects'),
]
