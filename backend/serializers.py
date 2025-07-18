from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'address', 'date_of_birth']

class ClassSerializer(serializers.ModelSerializer):
      ['phone', 'address', 'date_of_birth']

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'section', 'academic_year', 'capacity', 'created_at']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'credits', 'description']

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    subjects = SubjectSerializer(many=True, read_only=True)
    classes = ClassSerializer(many=True, read_only=True)
    
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'employee_id', 'department', 'qualification', 'subjects', 'classes']

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    student_class = ClassSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'user', 'roll_number', 'student_class', 'admission_date', 'parent_name', 'parent_phone']

class ScheduleSerializer(serializers.ModelSerializer):
    class_assigned = ClassSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    
    class Meta:
        model = Schedule
        fields = ['id', 'class_assigned', 'subject', 'teacher', 'day_of_week', 'start_time', 'end_time', 'room_number']

class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    marked_by = TeacherSerializer(read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'subject', 'date', 'is_present', 'marked_by', 'created_at']

class ExaminationSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    class_assigned = ClassSerializer(read_only=True)
    created_by = TeacherSerializer(read_only=True)
    
    class Meta:
        model = Examination
        fields = ['id', 'name', 'exam_type', 'subject', 'class_assigned', 'date', 'start_time', 'end_time', 'total_marks', 'created_by']

class MarksSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    examination = ExaminationSerializer(read_only=True)
    entered_by = TeacherSerializer(read_only=True)
    
    class Meta:
        model = Marks
        fields = ['id', 'student', 'examination', 'marks_obtained', 'remarks', 'entered_by', 'created_at']

class AssignmentSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    class_assigned = ClassSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'subject', 'class_assigned', 'teacher', 'assigned_date', 'due_date', 'total_marks', 'file_attachment']

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    
    class Meta:
        model = AssignmentSubmission
        fields = ['id', 'assignment', 'student', 'submission_file', 'submission_text', 'submitted_at', 'marks_obtained', 'feedback']

class NoticeSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    target_class = ClassSerializer(read_only=True)
    
    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'priority', 'target_audience', 'target_class', 'created_by', 'created_at', 'is_active']

class FeedbackSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = Feedback
        fields = ['id', 'feedback_type', 'from_user', 'to_user', 'subject', 'rating', 'comments', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp', 'is_read']

class DownloadableResourceSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    class_assigned = ClassSerializer(read_only=True)
    
    class Meta:
        model = DownloadableResource
        fields = ['id', 'title', 'description', 'resource_type', 'file', 'subject', 'class_assigned', 'uploaded_by', 'upload_date', 'is_public']
