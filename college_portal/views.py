from django.shortcuts import render
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, BasePermission
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Count, Q, F, Sum, Avg
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from .models import *
from .serializers import *

User = get_user_model()

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff or request.user.user_type == 'admin'

class IsTeacherOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type in ['teacher', 'admin']

class IsStudentOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type in ['student', 'admin']

def home(request):
    """Simple home page view"""
    return render(request, 'college_portal/home.html', {
        'title': 'College Portal',
        'welcome_message': 'Welcome to the College Management System',
        'features': [
            'Student Management',
            'Teacher Management',
            'Attendance Tracking',
            'Exam and Results',
            'Assignment Management',
        ]
    })

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    def get_permissions(self):
        if self.action in ['create', 'list']:
            permission_classes = [IsAdminUser]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        user = request.user
        stats = {}
        
        if user.user_type == 'admin':
            stats = self._get_admin_stats()
        elif user.user_type == 'teacher':
            stats = self._get_teacher_stats(user)
        elif user.user_type == 'student':
            stats = self._get_student_stats(user)
            
        return Response(stats)
    
    def _get_admin_stats(self):
        return {
            'total_students': Student.objects.filter(is_active=True).count(),
            'total_teachers': Teacher.objects.filter(is_active=True).count(),
            'total_classes': Class.objects.count(),
            'total_subjects': Subject.objects.count(),
            'recent_notices': NoticeSerializer(
                Notice.objects.filter(is_active=True).order_by('-created_at')[:5], 
                many=True
            ).data,
            'recent_results': ResultSerializer(
                Result.objects.select_related('student__user', 'examination__subject')
                .order_by('-created_at')[:10], 
                many=True
            ).data,
        }
    
    def _get_teacher_stats(self, user):
        try:
            teacher = Teacher.objects.get(user=user)
            today = timezone.now().date()
            
            return {
                'my_classes': Class.objects.filter(class_teacher=user).count(),
                'my_subjects': teacher.subjects.count(),
                'total_students': Student.objects.filter(class_enrolled__class_teacher=user).count(),
                'today_schedule': ScheduleSerializer(
                    Schedule.objects.filter(
                        teacher=teacher,
                        weekday=today.strftime('%A').lower()
                    ).order_by('start_time'),
                    many=True
                ).data,
                'pending_assignments': Assignment.objects.filter(
                    teacher=teacher,
                    due_date__gte=timezone.now()
                ).count(),
                'recent_attendance': AttendanceSerializer(
                    Attendance.objects.filter(teacher=teacher)
                    .order_by('-date')[:10], 
                    many=True
                ).data,
            }
        except Teacher.DoesNotExist:
            return {'error': 'Teacher profile not found'}
    
    def _get_student_stats(self, user):
        student = get_object_or_404(Student, user=user)
        today = timezone.now().date()
        
        # Calculate attendance percentage
        total_attendance = Attendance.objects.filter(student=student).count()
        present_attendance = Attendance.objects.filter(student=student, is_present=True).count()
        attendance_percentage = (present_attendance / total_attendance * 100) if total_attendance > 0 else 0
        
        return {
            'class': f"{student.class_enrolled.name} - {student.class_enrolled.section}",
            'attendance_percentage': round(attendance_percentage, 2),
            'pending_assignments': Assignment.objects.filter(
                class_assigned=student.class_enrolled,
                due_date__gte=timezone.now()
            ).exclude(
                assignmentsubmission__student=student
            ).count(),
            'today_schedule': ScheduleSerializer(
                Schedule.objects.filter(
                    class_assigned=student.class_enrolled,
                    weekday=today.strftime('%A').lower()
                ).order_by('start_time'),
                many=True
            ).data,
            'recent_results': ResultSerializer(
                Result.objects.filter(student=student)
                .select_related('examination__subject')
                .order_by('-examination__date')[:5],
                many=True
            ).data,
        }
        


def calculate_attendance_percentage(student):
    total_attendance = Attendance.objects.filter(student=student).count()
    present_attendance = Attendance.objects.filter(student=student, is_present=True).count()
    
    if total_attendance > 0:
        return round((present_attendance / total_attendance) * 100, 2)
    return 0

# ViewSets for CRUD operations
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        return queryset
    
    @action(detail=True, methods=['get'])
    def classes(self, request, pk=None):
        department = self.get_object()
        classes = Class.objects.filter(department=department)
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by department if department_id is provided
        department_id = self.request.query_params.get('department_id')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        return queryset
    
    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        class_obj = self.get_object()
        students = Student.objects.filter(class_enrolled=class_obj, is_active=True)
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def schedule(self, request, pk=None):
        class_obj = self.get_object()
        weekday = request.query_params.get('weekday')
        schedules = Schedule.objects.filter(class_assigned=class_obj)
        
        if weekday:
            schedules = schedules.filter(weekday=weekday.lower())
            
        serializer = ScheduleSerializer(schedules.order_by('start_time'), many=True)
        return Response(serializer.data)

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        department_id = self.request.query_params.get('department_id')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        return queryset
    
    @action(detail=True, methods=['get'])
    def teachers(self, request, pk=None):
        subject = self.get_object()
        teachers = Teacher.objects.filter(subjects=subject, is_active=True)
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.filter(is_active=True)
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        department_id = self.request.query_params.get('department_id')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        return queryset
    
    @action(detail=True, methods=['get'])
    def classes(self, request, pk=None):
        teacher = self.get_object()
        classes = teacher.class_set.all()
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def schedule(self, request, pk=None):
        teacher = self.get_object()
        weekday = request.query_params.get('weekday')
        schedules = Schedule.objects.filter(teacher=teacher)
        
        if weekday:
            schedules = schedules.filter(weekday=weekday.lower())
            
        serializer = ScheduleSerializer(schedules.order_by('start_time'), many=True)
        return Response(serializer.data)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(class_enrolled_id=class_id)
        return queryset
    
    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        student = self.get_object()
        subject_id = request.query_params.get('subject_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        attendance = Attendance.objects.filter(student=student)
        
        if subject_id:
            attendance = attendance.filter(subject_id=subject_id)
        if start_date:
            attendance = attendance.filter(date__gte=start_date)
        if end_date:
            attendance = attendance.filter(date__lte=end_date)
            
        serializer = AttendanceSerializer(attendance.order_by('-date'), many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        student = self.get_object()
        subject_id = request.query_params.get('subject_id')
        
        results = Result.objects.filter(student=student)
        
        if subject_id:
            results = results.filter(examination__subject_id=subject_id)
            
        serializer = ResultSerializer(results.order_by('-examination__date'), many=True)
        return Response(serializer.data)

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        class_id = self.request.query_params.get('class_id')
        teacher_id = self.request.query_params.get('teacher_id')
        weekday = self.request.query_params.get('weekday')
        
        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if weekday:
            queryset = queryset.filter(weekday=weekday.lower())
            
        return queryset.order_by('weekday', 'start_time')

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        student_id = self.request.query_params.get('student_id')
        subject_id = self.request.query_params.get('subject_id')
        date = self.request.query_params.get('date')
        
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if date:
            queryset = queryset.filter(date=date)
            
        return queryset.order_by('-date')
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all()
    serializer_class = ExaminationSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        class_id = self.request.query_params.get('class_id')
        subject_id = self.request.query_params.get('subject_id')
        exam_type = self.request.query_params.get('exam_type')
        
        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if exam_type:
            queryset = queryset.filter(exam_type=exam_type.lower())
            
        return queryset.order_by('-date', 'start_time')
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        examination = self.get_object()
        results = Result.objects.filter(examination=examination)
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Add filtering if needed
        student_id = self.request.query_params.get('student_id')
        examination_id = self.request.query_params.get('examination_id')
        subject_id = self.request.query_params.get('subject_id')
        
        if self.request.user.user_type == 'student':
            queryset = queryset.filter(student__user=self.request.user)
        elif student_id:
            queryset = queryset.filter(student_id=student_id)
            
        if examination_id:
            queryset = queryset.filter(examination_id=examination_id)
        if subject_id:
            queryset = queryset.filter(examination__subject_id=subject_id)
            
        return queryset.order_by('-examination__date')
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.filter(is_active=True)
    serializer_class = NoticeSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Filter by target audience
        if user.user_type == 'teacher':
            queryset = queryset.filter(
                Q(target_audience='teacher') | Q(target_audience='all')
            )
        elif user.user_type == 'student':
            queryset = queryset.filter(
                Q(target_audience='student') | Q(target_audience='all')
            )
            
        # Filter by priority if provided
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority.lower())
            
        return queryset.order_by('-created_at')
    
    def perform_destroy(self, instance):
        # Soft delete
        instance.is_active = False
        instance.save()

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Students can only see their own class assignments
        if user.user_type == 'student':
            student = Student.objects.filter(user=user).first()
            if student:
                queryset = queryset.filter(class_assigned=student.class_enrolled)
        # Teachers can only see their own assignments
        elif user.user_type == 'teacher':
            teacher = Teacher.objects.filter(user=user).first()
            if teacher:
                queryset = queryset.filter(teacher=teacher)
                
        # Filter by class and subject if provided
        class_id = self.request.query_params.get('class_id')
        subject_id = self.request.query_params.get('subject_id')
        
        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
            
        # Filter by due date
        due_date = self.request.query_params.get('due_date')
        if due_date:
            queryset = queryset.filter(due_date__date=due_date)
            
        return queryset.order_by('-due_date')
    
    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        assignment = self.get_object()
        submissions = AssignmentSubmission.objects.filter(assignment=assignment)
        serializer = AssignmentSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AssignmentSubmission.objects.all()
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Students can only see their own submissions
        if user.user_type == 'student':
            student = Student.objects.filter(user=user).first()
            if student:
                queryset = queryset.filter(student=student)
        # Teachers can see all submissions for their assignments
        elif user.user_type == 'teacher':
            teacher = Teacher.objects.filter(user=user).first()
            if teacher:
                queryset = queryset.filter(assignment__teacher=teacher)
                
        # Filter by assignment if provided
        assignment_id = self.request.query_params.get('assignment_id')
        if assignment_id:
            queryset = queryset.filter(assignment_id=assignment_id)
            
        return queryset.order_by('-submitted_at')
    
    def perform_create(self, serializer):
        # Set the student to the current user's student profile
        student = Student.objects.get(user=self.request.user)
        assignment = serializer.validated_data['assignment']
        
        # Check for late submission
        is_late = timezone.now() > assignment.due_date
        
        serializer.save(student=student, is_late=is_late)
    
    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        submission = self.get_object()
        marks = request.data.get('marks_obtained')
        feedback = request.data.get('feedback', '')
        
        if marks is None:
            return Response(
                {'error': 'marks_obtained is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        submission.marks_obtained = marks
        submission.feedback = feedback
        submission.save()
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)

# Custom API endpoints
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request):
    if request.user.user_type != 'teacher':
        return Response({'error': 'Only teachers can mark attendance'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        teacher = Teacher.objects.get(user=request.user)
        attendance_data = request.data.get('attendance', [])
        
        for item in attendance_data:
            student_id = item.get('student_id')
            subject_id = item.get('subject_id')
            is_present = item.get('is_present', False)
            date = item.get('date', timezone.now().date())
            
            student = Student.objects.get(id=student_id)
            subject = Subject.objects.get(id=subject_id)
            
            attendance, created = Attendance.objects.get_or_create(
                student=student,
                subject=subject,
                teacher=teacher,
                date=date,
                defaults={'is_present': is_present}
            )
            
            if not created:
                attendance.is_present = is_present
                attendance.save()
        
        return Response({'message': 'Attendance marked successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_attendance(request):
    if request.user.user_type != 'student':
        return Response({'error': 'Only students can view their attendance'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        student = Student.objects.get(user=request.user)
        attendance = Attendance.objects.filter(student=student).order_by('-date')
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)
    except Student.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_results(request):
    if request.user.user_type != 'student':
        return Response({'error': 'Only students can view their results'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        student = Student.objects.get(user=request.user)
        results = Result.objects.filter(student=student).order_by('-created_at')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)
    except Student.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_classes(request):
    if request.user.user_type != 'teacher':
        return Response({'error': 'Only teachers can view their classes'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        teacher = Teacher.objects.get(user=request.user)
        classes = Class.objects.filter(class_teacher=request.user)
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)
    except Teacher.DoesNotExist:
        return Response({'error': 'Teacher profile not found'}, status=status.HTTP_404_NOT_FOUND)
