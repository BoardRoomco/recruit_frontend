import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import JobList from "./pages/jobs/list";
import JobDetail from "./pages/jobs/detail";
import Dashboard from "./pages/dashboard/dashboard";
import CreateJob from "./pages/dashboard/create";
import JobApplicants from "./pages/dashboard/jobDetail";
import EditJob from "./pages/dashboard/edit";
import CandidateProfile from "./pages/candidate/profile";
import CandidateApps from "./pages/candidate/applications";

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

// Home Page Component
import TitleLogo from './assets/titlelogo.svg';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Section */}
      <main className="flex-1 flex items-center justify-start px-4 md:px-16 relative overflow-hidden">
        {/* Soft lavender gradient overlay on the right */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'linear-gradient(90deg, rgba(232,230,252,0) 60%, #E8E6FC 100%)'}} />
        <div className="relative z-10 max-w-2xl py-24">
          <h1 className="text-4xl md:text-6xl font-fustat font-bold text-graphite mb-8 leading-tight text-left">
            The only hiring platform<br />built for hardtech.
          </h1>
          <p className="max-w-xl text-lg md:text-2xl font-dmsans text-graphite mb-10 text-left">
            Simulation-based assessments that save engineering time and cut technical mis-hires. We handle everything — from scenario design to candidate ranking — so your team can hire <span className="text-violet font-semibold">faster</span>, and <span className="text-violet font-semibold">smarter</span>.
          </p>
          <a
            href="https://calendly.com/boardroomco/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet text-white font-dmsans font-semibold text-lg shadow-lg hover:bg-corePurple transition text-left"
          >
            Book a demo
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3" />
            </svg>
          </a>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Protected routes for candidates */}
            <Route 
              path="/candidate/profile" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate/applications" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateApps />
                </ProtectedRoute>
              } 
            />

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

            {/* Catch-all route for 404 */}
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">404 - Page Not Found</h1></div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;