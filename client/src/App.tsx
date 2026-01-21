import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme';
import './styles/global.css';
import './styles/responsive.css';

// Lazy loading للصفحات
const Login = lazy(() => import('./pages/Login'));
const Departments = lazy(() => import('./pages/Departments'));
const Semesters = lazy(() => import('./pages/Semesters'));
const Courses = lazy(() => import('./pages/Courses'));
const Forum = lazy(() => import('./pages/Forum'));

const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));

const ProfessorDashboard = lazy(() => import('./pages/professor/Dashboard'));
const CourseManagement = lazy(() => import('./pages/professor/CourseManagement'));
const ProfessorStudents = lazy(() => import('./pages/professor/Students'));

const RootDashboard = lazy(() => import('./pages/admin/RootDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminCourses = lazy(() => import('./pages/admin/CoursesAdmin'));
const AdminStats = lazy(() => import('./pages/admin/Stats'));
const AdminSecurity = lazy(() => import('./pages/admin/Security'));

// Protected Route Component
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles: string[] }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.token) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CustomThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <Router>
                <Layout>
                  <Suspense fallback={<LoadingSpinner type="page" />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/" element={<Navigate to="/login" />} />
                      
                      {/* Protected Routes */}
                      <Route path="/departments" element={
                        <ProtectedRoute roles={['student', 'professor', 'admin', 'root']}>
                          <Departments />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/semesters" element={
                        <ProtectedRoute roles={['student', 'professor', 'admin', 'root']}>
                          <Semesters />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/courses" element={
                        <ProtectedRoute roles={['student', 'professor', 'admin', 'root']}>
                          <Courses />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/forum/:courseId" element={
                        <ProtectedRoute roles={['student', 'professor', 'admin', 'root']}>
                          <Forum />
                        </ProtectedRoute>
                      } />
                      
                      {/* Student Routes */}
                      <Route path="/student/dashboard" element={
                        <ProtectedRoute roles={['student']}>
                          <StudentDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/student/profile" element={
                        <ProtectedRoute roles={['student']}>
                          <StudentProfile />
                        </ProtectedRoute>
                      } />
                      
                      {/* Professor Routes */}
                      <Route path="/professor/dashboard" element={
                        <ProtectedRoute roles={['professor', 'admin', 'root']}>
                          <ProfessorDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/professor/courses" element={
                        <ProtectedRoute roles={['professor', 'admin', 'root']}>
                          <CourseManagement />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/professor/students" element={
                        <ProtectedRoute roles={['professor', 'admin', 'root']}>
                          <ProfessorStudents />
                        </ProtectedRoute>
                      } />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute roles={['root']}>
                          <RootDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/users" element={
                        <ProtectedRoute roles={['root']}>
                          <AdminUsers />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/courses" element={
                        <ProtectedRoute roles={['root']}>
                          <AdminCourses />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/stats" element={
                        <ProtectedRoute roles={['root']}>
                          <AdminStats />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/security" element={
                        <ProtectedRoute roles={['root']}>
                          <AdminSecurity />
                        </ProtectedRoute>
                      } />
                      
                      {/* 404 */}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </Router>
            </AuthProvider>
          </NotificationProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
