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
    <div className="min-h-screen bg-gradient-to-br from-white to-softLavender py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-4xl font-fustat font-bold text-graphite mb-2">Welcome back, {user?.company?.name}</h1>
              <p className="text-graphite font-dmsans text-lg">Here's what's happening with your job assessments</p>
            </div>
            {/* Removed large Create New Job button here */}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 font-dmsans">{error}</p>
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
              <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
                <div className="p-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-softLavender rounded-lg flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-violet" weight="regular" />
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dl>
                      <dt className="text-xs font-medium text-graphite font-dmsans">Active Jobs</dt>
                      <dd className="text-lg font-bold text-graphite font-fustat">
                        {jobs.filter(job => job.status === 'active').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
                <div className="p-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-softLavender rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-violet" weight="regular" />
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dl>
                      <dt className="text-xs font-medium text-graphite font-dmsans">Total Candidates</dt>
                      <dd className="text-lg font-bold text-graphite font-fustat">{applications.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
                <div className="p-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-softLavender rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-violet" weight="regular" />
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dl>
                      <dt className="text-xs font-medium text-graphite font-dmsans">Pending Reviews</dt>
                      <dd className="text-lg font-bold text-graphite font-fustat">
                        {applications.filter(app => app.status === 'submitted').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </>
          )}
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
                className="w-full md:w-72 px-4 py-2 rounded-full border border-gray-200 bg-white text-graphite font-dmsans text-sm focus:outline-none focus:ring-1 focus:ring-violet"
              />
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-graphite font-dmsans text-sm shadow-sm hover:bg-gray-50 transition"
                onClick={() => setFilterOpen(true)}
              >
                <FunnelSimple size={18} className="text-gray-500" />
                Filter
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium font-dmsans transition ${view === 'card' ? 'bg-gray-100 text-graphite' : 'bg-white text-graphite border border-gray-200'}`}
                onClick={() => setView('card')}
              >
                Card View
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium font-dmsans transition ${view === 'table' ? 'bg-gray-100 text-graphite' : 'bg-white text-graphite border border-gray-200'}`}
                onClick={() => setView('table')}
              >
                Table View
              </button>
              <Link
                to="/dashboard/create"
                className="inline-flex items-center px-4 py-2 border border-violet rounded-full text-sm font-medium text-violet bg-white hover:bg-violet hover:text-white font-dmsans transition"
              >
                <Plus className="w-4 h-4 mr-1" weight="regular" />
                New Job Posting
              </Link>
            </div>
          </div>
          {/* Filter Modal (placeholder) */}
          {filterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
                <h3 className="text-lg font-fustat font-bold text-graphite mb-4">Filter Jobs</h3>
                <p className="text-graphite font-dmsans mb-6">(Filter options coming soon!)</p>
                <button
                  className="px-4 py-2 rounded-full bg-gray-100 text-graphite font-dmsans font-medium hover:bg-gray-200 transition"
                  onClick={() => setFilterOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())).map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 relative group hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/dashboard/jobs/${job.id}`); }}
                >
                  <div className="flex items-start justify-between pr-8">
                    <div className="flex-1">
                      <h3 className="text-sm font-fustat font-bold text-graphite mb-1">{job.title}</h3>
                      <p className="text-xs text-gray-500 font-dmsans">Hardware Engineering • San Francisco, CA</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium font-dmsans ml-2 ${job.status === 'active' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{job.status === 'active' ? 'Closed' : 'In Review'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-dmsans">
                    <User size={14} className="text-gray-400" />
                    {job._count?.applications || 0} candidates assessed
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-dmsans">Top candidate</span>
                      <span className="text-sm font-bold text-graphite font-fustat">
                        {job.title.toLowerCase().includes('electrical') ? '72' : 
                         job.title.toLowerCase().includes('mechanical') || job.title.toLowerCase().includes('mechatronics') ? '86' : 
                         `${Math.floor(Math.random() * 20) + 80}`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-gray-300 rounded-full" style={{ 
                        width: `${job.title.toLowerCase().includes('electrical') ? 72 : 
                                job.title.toLowerCase().includes('mechanical') || job.title.toLowerCase().includes('mechatronics') ? 86 : 
                                Math.floor(Math.random() * 20) + 80}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Actions Menu */}
                  <div className="absolute top-4 right-2">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 transition"
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
                <div className="col-span-full text-center text-graphite font-dmsans text-sm py-8">No jobs found.</div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-white">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-graphite font-dmsans">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-graphite font-dmsans">Candidates</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-graphite font-dmsans">Date Created</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-graphite font-dmsans">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())).map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/dashboard/jobs/${job.id}`)}>
                      <td className="px-3 py-2 text-graphite font-dmsans text-sm">
                        <span className="hover:text-violet hover:underline transition">{job.title}</span>
                      </td>
                      <td className="px-3 py-2 text-graphite font-dmsans text-sm">{job._count?.applications || 0}</td>
                      <td className="px-3 py-2 text-graphite font-dmsans text-sm">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="relative">
                          <button 
                            className="p-1.5 rounded-full hover:bg-gray-100 transition" 
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
                      <td colSpan={4} className="px-3 py-8 text-center text-graphite font-dmsans text-sm">No jobs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;