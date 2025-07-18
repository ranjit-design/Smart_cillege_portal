from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'user_type', 'is_active']
    list_filter = ['user_type', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'phone', 'address', 'profile_picture', 'date_of_birth')
        }),
    )

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'head_of_department', 'created_at']
    search_fields = ['name', 'code']
    list_filter = ['created_at']

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'section', 'department', 'class_teacher', 'total_students', 'academic_year']
    list_filter = ['department', 'academic_year']
    search_fields = ['name', 'section']

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'credits', 'department', 'semester']
    list_filter = ['department', 'semester', 'credits']
    search_fields = ['name', 'code']

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['user', 'employee_id', 'department', 'qualification', 'experience_years', 'is_active']
    list_filter = ['department', 'is_active', 'joining_date']
    search_fields = ['user__first_name', 'user__last_name', 'employee_id']
    filter_horizontal = ['subjects']

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'student_id', 'class_enrolled', 'roll_number', 'is_active']
    list_filter = ['class_enrolled', 'is_active', 'admission_date']
    search_fields = ['user__first_name', 'user__last_name', 'student_id', 'roll_number']

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['class_assigned', 'subject', 'teacher', 'weekday', 'start_time', 'end_time', 'room_number']
    list_filter = ['weekday', 'class_assigned', 'subject']
    search_fields = ['class_assigned__name', 'subject__name', 'teacher__user__first_name']

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'subject', 'teacher', 'date', 'is_present']
    list_filter = ['date', 'is_present', 'subject']
    search_fields = ['student__user__first_name', 'student__user__last_name']
    date_hierarchy = 'date'

@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ['name', 'exam_type', 'subject', 'class_assigned', 'date', 'total_marks']
    list_filter = ['exam_type', 'date', 'subject']
    search_fields = ['name', 'subject__name']
    date_hierarchy = 'date'

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'examination', 'marks_obtained', 'grade']
    list_filter = ['grade', 'examination__exam_type']
    search_fields = ['student__user__first_name', 'student__user__last_name']

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'target_audience', 'created_by', 'is_active', 'created_at']
    list_filter = ['priority', 'target_audience', 'is_active', 'created_at']
    search_fields = ['title', 'content']
    date_hierarchy = 'created_at'

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'class_assigned', 'teacher', 'due_date', 'total_marks']
    list_filter = ['subject', 'class_assigned', 'due_date']
    search_fields = ['title', 'description']
    date_hierarchy = 'due_date'

@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['assignment', 'student', 'submitted_at', 'marks_obtained', 'is_late']
    list_filter = ['is_late', 'submitted_at']
    search_fields = ['assignment__title', 'student__user__first_name']
    date_hierarchy = 'submitted_at'
