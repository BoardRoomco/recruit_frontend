import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import JobList from "./pages/jobs/list";
import JobDetail from "./pages/jobs/detail";
import Dashboard from "./pages/dashboard/dashboard";
import CreateJob from "./pages/dashboard/create";
import JobApplicants from "./pages/dashboard/jobDetail";
import EditJob from "./pages/dashboard/edit";
import CandidateProfile from "./pages/candidate/profile";
import CandidateDetailProfile from "./pages/dashboard/candidateProfile";
import CandidateApps from "./pages/candidate/applications";
import Candidates from "./pages/dashboard/candidates";
import Jobs from "./pages/dashboard/jobs";
import Settings from "./pages/dashboard/settings";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <Routes>
              {/* Public routes - no sidebar margin */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Protected routes for candidates */}
              <Route 
                path="/candidate/profile" 
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <CandidateProfile />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/candidate/applications" 
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <CandidateApps />
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* Protected routes for employers - with dynamic sidebar margin */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <Dashboard />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/jobs" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <Jobs />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/candidates" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <Candidates />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <Settings />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/create" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <CreateJob />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/jobs/:id" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <JobApplicants />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/jobs/:id/edit" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <EditJob />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/jobs/:jobId/candidates/:candidateId" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                      <CandidateDetailProfile />
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">404 - Page Not Found</h1></div>} />
            </Routes>
          </div>
        </Router>
    </AuthProvider>
  );
}



export default App;