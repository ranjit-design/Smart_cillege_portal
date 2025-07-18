from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Avg, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

from .models import *
from .serializers import *

# Authentication Views
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# Admin Views
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all()
    serializer_class = ExaminationSerializer
    permission_classes = [IsAuthenticated]

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    permission_classes = [IsAuthenticated]

# Teacher Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_classes(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    teacher = Teacher.objects.get(user=request.user)
    classes = teacher.classes.all()
    serializer = ClassSerializer(classes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    teacher = Teacher.objects.get(user=request.user)
    class_id = request.data.get('class_id')
    date = request.data.get('date')
    attendance_records = request.data.get('attendance_records')
    
    for record in attendance_records:
        student = Student.objects.get(id=record['student_id'])
        subject = Subject.objects.get(id=request.data.get('subject_id'))
        
        attendance, created = Attendance.objects.get_or_create(
            student=student,
            subject=subject,
            date=date,
            defaults={
                'is_present': record['is_present'],
                'marked_by': teacher
            }
        )
        
        if not created:
            attendance.is_present = record['is_present']
            attendance.save()
    
    return Response({'message': 'Attendance marked successfully'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enter_marks(request):
    if request.user.role != 'teacher':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    teacher = Teacher.objects.get(user=request.user)
    examination_id = request.data.get('examination_id')
    marks_data = request.data.get('marks_data')
    
    examination = Examination.objects.get(id=examination_id)
    
    for mark_entry in marks_data:
        student = Student.objects.get(id=mark_entry['student_id'])
        
        marks, created = Marks.objects.get_or_create(
            student=student,
            examination=examination,
            defaults={
                'marks_obtained': mark_entry['marks_obtained'],
                'remarks': mark_entry.get('remarks', ''),
                'entered_by': teacher
            }
        )
        
        if not created:
            marks.marks_obtained = mark_entry['marks_obtained']
            marks.remarks = mark_entry.get('remarks', '')
            marks.save()
    
    return Response({'message': 'Marks entered successfully'})

# Student Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_attendance(request):
    if request.user.role != 'student':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    student = Student.objects.get(user=request.user)
    attendance_records = Attendance.objects.filter(student=student).order_by('-date')
    
    data = []
    for record in attendance_records:
        data.append({
            'id': record.id,
            'date': record.date,
            'subject_name': record.subject.name,
            'subject_id': record.subject.id,
            'is_present': record.is_present,
            'time': record.created_at.strftime('%H:%M')
        })
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_marks(request):
    if request.user.role != 'student':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    student = Student.objects.get(user=request.user)
    marks = Marks.objects.filter(student=student).select_related('examination', 'examination__subject')
    
    data = []
    for mark in marks:
        data.append({
            'id': mark.id,
            'subject': mark.examination.subject.name,
            'exam_name': mark.examination.name,
            'exam_type': mark.examination.exam_type,
            'marks_obtained': mark.marks_obtained,
            'total_marks': mark.examination.total_marks,
            'percentage': (mark.marks_obtained / mark.examination.total_marks) * 100,
            'date': mark.examination.date,
            'remarks': mark.remarks
        })
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def performance_prediction(request):
    if request.user.role != 'student':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    student = Student.objects.get(user=request.user)
    marks = Marks.objects.filter(student=student).order_by('examination__date')
    
    if marks.count() < 3:
        return Response({'message': 'Insufficient data for prediction'})
    
    # Prepare data for prediction
    data = []
    for i, mark in enumerate(marks):
        percentage = (mark.marks_obtained / mark.examination.total_marks) * 100
        data.append([i, percentage])
    
    df = pd.DataFrame(data, columns=['exam_number', 'percentage'])
    
    # Simple linear regression for trend prediction
    X = df[['exam_number']]
    y = df['percentage']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next 3 exams
    next_exams = [[len(data) + i] for i in range(1, 4)]
    predictions = model.predict(next_exams)
    
    # Calculate trend
    slope = model.coef_[0]
    trend = 'improving' if slope > 0 else 'declining' if slope < 0 else 'stable'
    
    return Response({
        'current_average': df['percentage'].mean(),
        'trend': trend,
        'predictions': predictions.tolist(),
        'recommendation': get_performance_recommendation(df['percentage'].mean(), trend)
    })

def get_performance_recommendation(average, trend):
    if average >= 80:
        if trend == 'improving':
            return "Excellent work! Keep up the momentum."
        elif trend == 'declining':
            return "Good performance but showing decline. Review study methods."
        else:
            return "Consistent excellent performance. Consider challenging yourself more."
    elif average >= 60:
        if trend == 'improving':
            return "Good progress! Continue with current study approach."
        elif trend == 'declining':
            return "Performance declining. Consider seeking help from teachers."
        else:
            return "Average performance. Focus on weak subjects."
    else:
        return "Performance needs improvement. Consider additional study support."

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_assignments(request):
    if request.user.role != 'student':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    student = Student.objects.get(user=request.user)
    assignments = Assignment.objects.filter(class_assigned=student.student_class)
    
    data = []
    for assignment in assignments:
        submission = AssignmentSubmission.objects.filter(
            assignment=assignment, 
            student=student
        ).first()
        
        data.append({
            'id': assignment.id,
            'title': assignment.title,
            'description': assignment.description,
            'subject': assignment.subject.name,
            'assigned_date': assignment.assigned_date,
            'due_date': assignment.due_date,
            'total_marks': assignment.total_marks,
            'is_submitted': submission is not None,
            'submission_date': submission.submitted_at if submission else None,
            'marks_obtained': submission.marks_obtained if submission else None,
            'feedback': submission.feedback if submission else None,
        })
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_schedule(request):
    if request.user.role != 'student':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    student = Student.objects.get(user=request.user)
    schedules = Schedule.objects.filter(class_assigned=student.student_class).order_by('day_of_week', 'start_time')
    
    serializer = ScheduleSerializer(schedules, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_notifications(request):
    if request.user.role != 'student':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    student = Student.objects.get(user=request.user)
    
    notices = Notice.objects.filter(
        Q(target_audience='all') | 
        Q(target_audience='students') | 
        Q(target_audience='class_specific', target_class=student.student_class),
        is_active=True
    ).order_by('-created_at')
    
    serializer = NoticeSerializer(notices, many=True)
    return Response(serializer.data)
