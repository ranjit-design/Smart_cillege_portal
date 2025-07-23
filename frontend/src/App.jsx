import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Components
import Login from './components/auth/Login';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminOverview from './components/admin/AdminOverview';
import ClassManagement from './components/admin/ClassManagement';
import ExaminationManagement from './components/admin/ExaminationManagement';
import NoticeManagement from './components/admin/NoticeManagement';
import SubjectManagement from './components/admin/SubjectManagement';
import TeacherManagement from './components/admin/TeacherManagement';

// Teacher Components
import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherOverview from './components/teacher/TeacherOverview';
import TeacherSidebar from './components/teacher/TeacherSidebar';
import AssignmentManagement from './components/teacher/AssignmentManagement';
import AttendanceManagement from './components/teacher/AttendanceManagement';
import CommunicationTools from './components/teacher/CommunicationTools';
import FeedbackGeneration from './components/teacher/FeedbackGeneration';
import MarksEntry from './components/teacher/MarksEntry';
import ReportGeneration from './components/teacher/ReportGeneration';
import ScheduleManagement from './components/teacher/ScheduleManagement';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import StudentOverview from './components/student/StudentOverview';
import StudentSidebar from './components/student/StudentSidebar';
import AssignmentModule from './components/student/AssignmentModule';
import AttendanceTracker from './components/student/AttendanceTracker';
import ChatSupport from './components/student/ChatSupport';
import ClassSchedule from './components/student/ClassSchedule';
import DownloadCenter from './components/student/DownloadCenter';
import FeedbackSubmission from './components/student/FeedbackSubmission';
import MarksResultView from './components/student/MarksResultView';
import NotificationAlerts from './components/student/NotificationAlerts';
import PerformancePrediction from './components/student/PerformancePrediction';

// Protected Route Component
const ProtectedRoute = ({ requiredRole, children }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

// Layout Components
const AdminLayout = () => (
  <div className="flex h-screen">
    <AdminSidebar />
    <div className="flex-1 overflow-auto">
      <AdminDashboard />
      <Outlet />
    </div>
  </div>
);

const TeacherLayout = () => (
  <div className="flex h-screen">
    <TeacherSidebar />
    <div className="flex-1 overflow-auto">
      <TeacherDashboard />
      <Outlet />
    </div>
  </div>
);

const StudentLayout = () => (
  <div className="flex h-screen">
    <StudentSidebar />
    <div className="flex-1 overflow-auto">
      <StudentDashboard />
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="examinations" element={<ExaminationManagement />} />
              <Route path="notices" element={<NoticeManagement />} />
              <Route path="subjects" element={<SubjectManagement />} />
              <Route path="teachers" element={<TeacherManagement />} />
            </Route>
          </Route>


          {/* Teacher Routes */}
          <Route element={<ProtectedRoute requiredRole="teacher" />}>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherOverview />} />
              <Route path="assignments" element={<AssignmentManagement />} />
              <Route path="attendance" element={<AttendanceManagement />} />
              <Route path="communication" element={<CommunicationTools />} />
              <Route path="feedback" element={<FeedbackGeneration />} />
              <Route path="marks" element={<MarksEntry />} />
              <Route path="reports" element={<ReportGeneration />} />
              <Route path="schedule" element={<ScheduleManagement />} />
            </Route>
          </Route>


          {/* Student Routes */}
          <Route element={<ProtectedRoute requiredRole="student" />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentOverview />} />
              <Route path="assignments" element={<AssignmentModule />} />
              <Route path="attendance" element={<AttendanceTracker />} />
              <Route path="chat" element={<ChatSupport />} />
              <Route path="schedule" element={<ClassSchedule />} />
              <Route path="downloads" element={<DownloadCenter />} />
              <Route path="feedback" element={<FeedbackSubmission />} />
              <Route path="results" element={<MarksResultView />} />
              <Route path="notifications" element={<NotificationAlerts />} />
              <Route path="performance" element={<PerformancePrediction />} />
            </Route>
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;