import os
import sys
import django
from datetime import date, datetime, timedelta

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_college_backend.settings')
django.setup()

from college_portal.models import *
from django.contrib.auth.hashers import make_password

def create_sample_data():
    print("Creating sample data...")
    
    # Create Users
    admin_user = User.objects.create(
        username='admin',
        email='admin@college.com',
        first_name='Admin',
        last_name='User',
        user_type='admin',
        password=make_password('admin123'),
        is_staff=True,
        is_superuser=True
    )
    
    teacher_user = User.objects.create(
        username='teacher',
        email='teacher@college.com',
        first_name='John',
        last_name='Smith',
        user_type='teacher',
        password=make_password('teacher123')
    )
    
    student_user = User.objects.create(
        username='student',
        email='student@college.com',
        first_name='Jane',
        last_name='Doe',
        user_type='student',
        password=make_password('student123')
    )
    
    # Create Department
    cs_dept = Department.objects.create(
        name='Computer Science',
        code='CS',
        description='Computer Science Department',
        head_of_department=teacher_user
    )
    
    # Create Class
    cs_class = Class.objects.create(
        name='CS-101',
        section='A',
        department=cs_dept,
        class_teacher=teacher_user,
        academic_year='2024-25',
        total_students=30
    )
    
    # Create Subjects
    python_subject = Subject.objects.create(
        name='Python Programming',
        code='CS101',
        credits=4,
        department=cs_dept,
        semester=1,
        description='Introduction to Python Programming'
    )
    
    web_subject = Subject.objects.create(
        name='Web Development',
        code='CS102',
        credits=3,
        department=cs_dept,
        semester=1,
        description='HTML, CSS, JavaScript basics'
    )
    
    # Create Teacher
    teacher = Teacher.objects.create(
        user=teacher_user,
        employee_id='T001',
        department=cs_dept,
        qualification='M.Tech Computer Science',
        experience_years=5,
        salary=50000.00,
        joining_date=date(2020, 1, 15)
    )
    teacher.subjects.add(python_subject, web_subject)
    
    # Create Student
    student = Student.objects.create(
        user=student_user,
        student_id='S001',
        class_enrolled=cs_class,
        roll_number='001',
        admission_date=date(2024, 7, 1),
        guardian_name='John Doe Sr.',
        guardian_phone='1234567890',
        guardian_email='guardian@example.com'
    )
    
    # Create Schedule
    Schedule.objects.create(
        class_assigned=cs_class,
        subject=python_subject,
        teacher=teacher,
        weekday='monday',
        start_time='09:00',
        end_time='10:30',
        room_number='101'
    )
    
    Schedule.objects.create(
        class_assigned=cs_class,
        subject=web_subject,
        teacher=teacher,
        weekday='tuesday',
        start_time='10:30',
        end_time='12:00',
        room_number='102'
    )
    
    # Create Attendance
    for i in range(10):
        attendance_date = date.today() - timedelta(days=i)
        Attendance.objects.create(
            student=student,
            subject=python_subject,
            teacher=teacher,
            date=attendance_date,
            is_present=i % 3 != 0  # Present 2 out of 3 days
        )
    
    # Create Examination
    midterm_exam = Examination.objects.create(
        name='Python Midterm Exam',
        exam_type='midterm',
        subject=python_subject,
        class_assigned=cs_class,
        date=date.today() + timedelta(days=30),
        start_time='10:00',
        end_time='12:00',
        total_marks=100,
        passing_marks=40
    )
    
    # Create Result
    Result.objects.create(
        student=student,
        examination=midterm_exam,
        marks_obtained=85,
        remarks='Good performance'
    )
    
    # Create Notice
    Notice.objects.create(
        title='Welcome to New Academic Year',
        content='Welcome all students to the new academic year 2024-25. Classes will start from July 15th.',
        priority='high',
        target_audience='student',
        created_by=admin_user
    )
    
    # Create Assignment
    assignment = Assignment.objects.create(
        title='Python Basics Assignment',
        description='Complete the Python programming exercises in Chapter 1-3',
        subject=python_subject,
        class_assigned=cs_class,
        teacher=teacher,
        due_date=datetime.now() + timedelta(days=7),
        total_marks=50
    )
    
    # Create Assignment Submission
    AssignmentSubmission.objects.create(
        assignment=assignment,
        student=student,
        submission_text='Completed all exercises as requested.',
        marks_obtained=45,
        feedback='Well done! Good understanding of concepts.'
    )
    
    print("Sample data created successfully!")
    print("\nLogin Credentials:")
    print("Admin: admin / admin123")
    print("Teacher: teacher / teacher123")
    print("Student: student / student123")

if __name__ == '__main__':
    create_sample_data()
