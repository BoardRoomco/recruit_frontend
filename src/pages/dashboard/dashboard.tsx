import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { 
  Briefcase, 
  FileText, 
  Clock, 
  Plus, 
  Eye, 
  ArrowRight,
  User,
  Calendar,
  DotsThreeVertical,
  MagnifyingGlass,
  FunnelSimple,
  PencilSimple,
  Trash
} from '@phosphor-icons/react';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  candidate?: {
    firstName: string;
    lastName: string;
  };
  job?: {
    id: string;
    title: string;
  };
}

// Skeleton Loading Components
const StatsCardSkeleton = () => (
  <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 animate-pulse">
    <div className="p-6">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-48"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-6 w-6 bg-gray-200 rounded-full ml-auto"></div>
    </td>
  </tr>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setStatsLoading(true);
        setTableLoading(true);
        
        // Simulate progressive loading for better UX
        const [jobsData, applicationsData] = await Promise.all([
          jobsAPI.getByCompany(user?.company?.id || ''),
          applicationsAPI.getCompanyApplications()
        ]);
        
        setJobs(jobsData);
        setApplications(applicationsData);
        
        // Show stats first, then table
        setTimeout(() => setStatsLoading(false), 300);
        setTimeout(() => setTableLoading(false), 600);
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.company?.id) {
      fetchDashboardData();
    }
  }, [user?.company?.id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-softLavender flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-violet rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Briefcase className="h-8 w-8 text-white" weight="regular" />
          </div>
          <h2 className="text-2xl font-fustat font-bold text-graphite mb-2">Loading Dashboard</h2>
          <p className="text-graphite font-dmsans">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingJobId(jobId);
      await jobsAPI.delete(jobId);
      // Remove the job from the local state
      setJobs(jobs.filter(job => job.id !== jobId));
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeletingJobId(null);
    }
  };

  const toggleMenu = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === jobId ? null : jobId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Here's what's happening with your job assessments</p>
            </div>
            {/* Removed large Create New Job button here */}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-softLavender rounded-lg flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-violet" weight="regular" />
                      </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600">Active Jobs</dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          {jobs.filter(job => job.status === 'active').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-softLavender rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-violet" weight="regular" />
                      </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600">Total Candidates</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{applications.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-softLavender rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-violet" weight="regular" />
                      </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600">Pending Reviews</dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          {applications.filter(app => app.status === 'submitted').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Candidate Pipeline Funnel and Role Distribution */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Funnel - Left Side */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Candidate Pipeline</h3>
              <div className="max-w-sm mx-auto">
                <div className="space-y-4">
                  {/* Applied */}
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium text-gray-700">Applied</div>
                    <div className="flex-1 bg-gradient-to-r from-violet to-violet/80 rounded-lg h-8 flex items-center justify-end pr-4">
                      <span className="text-white font-semibold text-sm">{applications.length}</span>
                    </div>
                  </div>
                  
                  {/* Assessed */}
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium text-gray-700">Assessed</div>
                    <div className="flex-1 bg-gradient-to-r from-violet/80 to-violet/60 rounded-lg h-8 flex items-center justify-end pr-4" style={{ width: `${Math.min(100, (applications.filter(app => app.status === 'reviewed').length / applications.length) * 100)}%` }}>
                      <span className="text-white font-semibold text-sm">{applications.filter(app => app.status === 'reviewed').length}</span>
                    </div>
                  </div>
                  
                  {/* Interviewed */}
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium text-gray-700">Interviewed</div>
                    <div className="flex-1 bg-gradient-to-r from-violet/60 to-violet/40 rounded-lg h-8 flex items-center justify-end pr-4" style={{ width: `${Math.min(100, (applications.filter(app => app.status === 'interviewed').length / applications.length) * 100)}%` }}>
                      <span className="text-white font-semibold text-sm">{applications.filter(app => app.status === 'interviewed').length}</span>
                    </div>
                  </div>
                  
                  {/* Offered */}
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium text-gray-700">Offered</div>
                    <div className="flex-1 bg-gradient-to-r from-violet/40 to-violet/20 rounded-lg h-8 flex items-center justify-end pr-4" style={{ width: `${Math.min(100, (applications.filter(app => app.status === 'offered').length / applications.length) * 100)}%` }}>
                      <span className="text-white font-semibold text-sm">{applications.filter(app => app.status === 'offered').length}</span>
                    </div>
                  </div>
                  
                  {/* Hired */}
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium text-gray-700">Hired</div>
                    <div className="flex-1 bg-gradient-to-r from-violet/20 to-violet/10 rounded-lg h-8 flex items-center justify-end pr-4" style={{ width: `${Math.min(100, (applications.filter(app => app.status === 'hired').length / applications.length) * 100)}%` }}>
                      <span className="text-violet font-semibold text-sm">{applications.filter(app => app.status === 'hired').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Distribution Pie Chart - Right Side */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Role Distribution</h3>
              <div className="flex items-center justify-center">
                {/* Simple Pie Chart Visualization */}
                <div className="relative w-48 h-48">
                  {/* Mechanical Engineering */}
                  <div className="absolute inset-0 rounded-full border-8 border-violet transform rotate-0" style={{ 
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)',
                    transform: 'rotate(0deg)'
                  }}></div>
                  
                  {/* Electrical Engineering */}
                  <div className="absolute inset-0 rounded-full border-8 border-softLavender transform rotate-0" style={{ 
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)',
                    transform: 'rotate(0deg)'
                  }}></div>
                  
                  {/* Civil Engineering */}
                  <div className="absolute inset-0 rounded-full border-8 border-gray-300 transform rotate-0" style={{ 
                    clipPath: 'polygon(50% 50%, 50% 0%, 75% 0%, 75% 50%, 50% 50%)',
                    transform: 'rotate(0deg)'
                  }}></div>
                  
                  {/* Software Engineering */}
                  <div className="absolute inset-0 rounded-full border-8 border-violet/60 transform rotate-0" style={{ 
                    clipPath: 'polygon(50% 50%, 50% 0%, 62.5% 0%, 62.5% 50%, 50% 50%)',
                    transform: 'rotate(0deg)'
                  }}></div>
                  
                  {/* Center Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
                      <div className="text-xs text-gray-500">Total Jobs</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-violet rounded-full"></div>
                  <span className="text-sm text-gray-700">Mechanical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-softLavender rounded-full"></div>
                  <span className="text-sm text-gray-700">Electrical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-700">Civil</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-violet/60 rounded-full"></div>
                  <span className="text-sm text-gray-700">Software</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Job Postings - Left Side */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Job Postings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {jobs.slice(0, 5).map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/dashboard/jobs/${job.id}`)}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status === 'active' ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{job._count?.applications || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {jobs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">No job postings yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Candidates - Right Side */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Candidates</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied For</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {applications.slice(0, 5).map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => {
                        if (application.job?.id) {
                          navigate(`/dashboard/jobs/${application.job.id}/candidates/${application.id}`);
                        }
                      }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-softLavender rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-violet">
                                {application.candidate?.firstName?.charAt(0)}{application.candidate?.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.candidate?.firstName} {application.candidate?.lastName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{application.job?.title || 'Unknown Role'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                            application.status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
                            application.status === 'offered' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(application.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">No candidates yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;