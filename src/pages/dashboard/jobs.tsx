import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../services/api';
import { 
  Briefcase, 
  Plus, 
  Eye, 
  PencilSimple, 
  Trash,
  DotsThreeVertical,
  User,
  Calendar,
  MagnifyingGlass,
  FunnelSimple
} from '@phosphor-icons/react';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt?: string; // Added for table view
  _count?: {
    applications: number;
  };
}

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [view, setView] = useState<'card' | 'table'>('card');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Fake Rivian job data
        const fakeJobs: Job[] = [
          {
            id: '1',
            title: 'Sr. Battery Test Technician III',
            description: 'Lead battery testing and validation for electric vehicle systems',
            status: 'active',
            createdAt: '2024-01-15T10:00:00Z',
            _count: { applications: 260 }
          },
          {
            id: '2', 
            title: 'Sr. Mechanical Engineer, Mechanisms',
            description: 'Design and develop mechanical systems and mechanisms',
            status: 'active',
            createdAt: '2024-01-10T10:00:00Z',
            _count: { applications: 170 }
          },
          {
            id: '3',
            title: 'Validation Engineer, Chassis',
            description: 'Validate chassis systems and components for vehicle performance',
            status: 'active', 
            createdAt: '2024-01-05T10:00:00Z',
            _count: { applications: 172 }
          },
          {
            id: '4',
            title: 'Controls Test Engineer',
            description: 'Test and validate control systems for autonomous vehicles',
            status: 'active',
            createdAt: '2024-01-03T10:00:00Z', 
            _count: { applications: 45 }
          },
          {
            id: '5',
            title: 'Electronics Design Industrialization Manager',
            description: 'Lead electronics design industrialization processes',
            status: 'active',
            createdAt: '2024-01-01T10:00:00Z',
            _count: { applications: 96 }
          }
        ];
        
        setJobs(fakeJobs);
      } catch (err: any) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user?.company?.id]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;

    try {
      setDeletingJobId(jobId);
      await jobsAPI.delete(jobId);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-violet rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Briefcase className="h-8 w-8 text-white" weight="regular" />
          </div>
          <h2 className="text-2xl font-fustat font-bold text-graphite mb-2">Loading Jobs</h2>
          <p className="text-graphite font-dmsans">Fetching job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-4xl font-fustat font-bold text-graphite mb-2">Jobs</h1>
              <p className="text-graphite font-dmsans text-lg">Manage your job postings and track applications</p>
            </div>
            <Link
              to="/dashboard/create"
              className="inline-flex items-center px-4 py-2 border border-violet rounded-full text-sm font-medium text-violet bg-white hover:bg-violet hover:text-white font-dmsans transition"
            >
              <Plus className="w-4 h-4 mr-1" weight="regular" />
              New Job Posting
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-graphite font-dmsans text-sm focus:outline-none focus:ring-1 focus:ring-violet"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="appearance-none pl-10 pr-8 py-2 rounded-full border border-gray-200 bg-white text-graphite font-dmsans text-sm shadow-sm hover:bg-gray-50 transition focus:outline-none focus:ring-1 focus:ring-violet cursor-pointer"
                >
                  <option value="all">All Jobs</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
                <FunnelSimple size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid/Table */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
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
            </div>
          </div>
          
          {view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs
                .filter(job => {
                  const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
                  const matchesStatus = filterStatus === 'all' || 
                    (filterStatus === 'active' && job.status === 'active') ||
                    (filterStatus === 'inactive' && job.status !== 'active');
                  return matchesSearch && matchesStatus;
                })
                .map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition cursor-pointer relative group"
                    onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                  >
                    <div className="flex items-start justify-between pr-8 mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">Location</span>
                            <span className="text-xs text-gray-500 font-medium">Category</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-700">
                              {job.id === '1' ? 'Tustin, California US' :
                               job.id === '2' ? 'Irvine, California US' :
                               job.id === '3' ? 'Irvine, California US' :
                               job.id === '4' ? 'Palo Alto, California US' :
                               job.id === '5' ? 'Torrance, California US' : 'California, US'}
                            </span>
                            <span className="text-xs text-gray-700">Mechanical & Electrical Engineering</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium font-dmsans ml-2 ${
                        job.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {job.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-dmsans mb-3">
                      <User size={14} className="text-gray-400" />
                      {job._count?.applications || 0} candidates applied
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-dmsans">
                      <Calendar size={14} className="text-gray-400" />
                      Created {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    
                    {/* Actions Menu */}
                    <div className="absolute top-4 right-2">
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
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
                              navigate(`/dashboard/jobs/${job.id}`);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Eye size={14} className="mr-2" />
                            View Details
                          </button>
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
              
              {jobs.filter(job => {
                const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
                const matchesStatus = filterStatus === 'all' || 
                  (filterStatus === 'active' && job.status === 'active') ||
                  (filterStatus === 'inactive' && job.status !== 'active');
                return matchesSearch && matchesStatus;
              }).length === 0 && (
                <div className="col-span-full text-center text-gray-500 text-sm py-8">
                  {search ? 'No jobs found matching your search.' : 'No jobs found.'}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Job Details</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Candidates</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {jobs.filter(job => {
                      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'active' && job.status === 'active') ||
                        (filterStatus === 'inactive' && job.status !== 'active');
                      return matchesSearch && matchesStatus;
                    }).map(job => (
                      <tr key={job.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/dashboard/jobs/${job.id}`)}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">{job.title}</div>
                            <div className="text-xs text-gray-500">Hardware Engineering • San Francisco, CA</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status === 'active' ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <User size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-900">{job._count?.applications || 0}</span>
                            <span className="text-xs text-gray-500">candidates</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(job.updatedAt || job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative">
                            <button 
                              className="p-2 rounded-lg hover:bg-gray-100 transition" 
                              onClick={(e) => toggleMenu(job.id, e)}
                            >
                              <DotsThreeVertical size={18} weight="regular" className="text-gray-400" />
                            </button>
                            
                            {openMenuId === job.id && (
                              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[160px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    navigate(`/dashboard/jobs/${job.id}`);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Eye size={16} className="mr-3" />
                                  View Details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    navigate(`/dashboard/jobs/${job.id}/edit`);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <PencilSimple size={16} className="mr-3" />
                                  Edit Job
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteJob(job.id, job.title);
                                  }}
                                  disabled={deletingJobId === job.id}
                                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                                >
                                  <Trash size={16} className="mr-3" />
                                  {deletingJobId === job.id ? 'Deleting...' : 'Delete Job'}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {jobs.filter(job => {
                      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'active' && job.status === 'active') ||
                        (filterStatus === 'inactive' && job.status !== 'active');
                      return matchesSearch && matchesStatus;
                    }).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                          {search ? 'No jobs found matching your search.' : 'No jobs found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {/* This block was removed as per the edit hint */}
      </div>
    </div>
  );
};

export default Jobs;
