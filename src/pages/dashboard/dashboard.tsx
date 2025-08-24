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

        {/* View Toggle and Job Cards/Table Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-72 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-violet"
              />
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm shadow-sm hover:bg-gray-50 transition"
                onClick={() => setFilterOpen(true)}
              >
                <FunnelSimple size={16} className="text-gray-500" />
                Filter
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${view === 'card' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 border border-gray-200'}`}
                onClick={() => setView('card')}
              >
                Card View
              </button>
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${view === 'table' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 border border-gray-200'}`}
                onClick={() => setView('table')}
              >
                Table View
              </button>
              <Link
                to="/dashboard/create"
                className="inline-flex items-center px-4 py-2 border border-violet rounded-lg text-sm font-medium text-violet bg-white hover:bg-violet hover:text-white transition"
              >
                <Plus className="w-4 h-4 mr-1" weight="regular" />
                New Job Posting
              </Link>
            </div>
          </div>
          {view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())).map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col gap-3 relative group hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/dashboard/jobs/${job.id}`); }}
                >
                  <div className="flex items-start justify-between pr-6">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-xs text-gray-500">Hardware Engineering • San Francisco, CA</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      job.status === 'active' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {job.status === 'active' ? 'Closed' : 'In Review'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User size={14} className="text-gray-400" />
                    {job.title.toLowerCase().includes('electrical') ? '2/6' : `${job._count?.applications || 0}/${job._count?.applications || 0}`} candidates assessed
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Top candidate</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {job.title.toLowerCase().includes('electrical') ? '72' : 
                         job.title.toLowerCase().includes('mechanical') || job.title.toLowerCase().includes('mechatronics') ? '86' : 
                         `${Math.floor(Math.random() * 20) + 80}`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ 
                        width: `${job.title.toLowerCase().includes('electrical') ? 72 : 
                                job.title.toLowerCase().includes('mechanical') || job.title.toLowerCase().includes('mechatronics') ? 86 : 
                                Math.floor(Math.random() * 20) + 80}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Actions Menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      className="p-1 rounded hover:bg-gray-100 transition"
                      onClick={(e) => toggleMenu(job.id, e)}
                    >
                      <DotsThreeVertical size={16} weight="regular" className="text-gray-400" />
                    </button>
                    
                    {openMenuId === job.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            navigate(`/dashboard/jobs/${job.id}/edit`);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <PencilSimple size={14} className="mr-2" />
                          Edit Job
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(job.id, job.title);
                          }}
                          disabled={deletingJobId === job.id}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                        >
                          <Trash size={14} className="mr-2" />
                          {deletingJobId === job.id ? 'Deleting...' : 'Delete Job'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                <div className="col-span-full text-center text-gray-500 text-sm py-8">No jobs found.</div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Candidates</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date Created</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())).map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/dashboard/jobs/${job.id}`)}>
                      <td className="px-4 py-3 text-gray-900 font-medium text-sm">
                        <span className="hover:text-violet hover:underline transition">{job.title}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{job._count?.applications || 0}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative">
                          <button 
                            className="p-1.5 rounded hover:bg-gray-100 transition" 
                            onClick={(e) => toggleMenu(job.id, e)}
                          >
                            <DotsThreeVertical size={16} weight="regular" className="text-gray-400" />
                          </button>
                          
                          {openMenuId === job.id && (
                            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  navigate(`/dashboard/jobs/${job.id}/edit`);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <PencilSimple size={14} className="mr-2" />
                                Edit Job
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteJob(job.id, job.title);
                                }}
                                disabled={deletingJobId === job.id}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                              >
                                <Trash size={14} className="mr-2" />
                                {deletingJobId === job.id ? 'Deleting...' : 'Delete Job'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">No jobs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Filter Modal (placeholder) */}
          {filterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h3>
                <p className="text-gray-600 mb-6">(Filter options coming soon!)</p>
                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition"
                  onClick={() => setFilterOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;