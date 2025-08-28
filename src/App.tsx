import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ReferralPage from "./pages/referral/referral";

import Dashboard from "./pages/dashboard/dashboard";
import CreateJob from "./pages/dashboard/create";
import JobApplicants from "./pages/dashboard/jobDetail";
import EditJob from "./pages/dashboard/edit";
import CandidateDetailProfile from "./pages/dashboard/candidateProfile";

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
          <Navigation />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/referral" element={<ReferralPage />} />

            {/* Protected routes for employers */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/create" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <CreateJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/jobs/:id" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <JobApplicants />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/jobs/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <EditJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/jobs/:jobId/candidates/:candidateId" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <CandidateDetailProfile />
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