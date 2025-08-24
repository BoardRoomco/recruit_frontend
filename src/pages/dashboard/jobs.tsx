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
  _count?: {
    applications: number;
  };
}

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobsAPI.getByCompany(user?.company?.id || '');
        setJobs(data);
      } catch (err: any) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.company?.id) {
      fetchJobs();
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

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

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
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-graphite font-dmsans text-sm shadow-sm hover:bg-gray-50 transition"
                onClick={() => setFilterOpen(true)}
              >
                <FunnelSimple size={18} className="text-gray-500" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs
            .filter(job => job.title.toLowerCase().includes(search.toLowerCase()))
            .map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition cursor-pointer relative group"
                onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
              >
                <div className="flex items-start justify-between pr-8 mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-fustat font-bold text-graphite mb-1">{job.title}</h3>
                    <p className="text-xs text-gray-500 font-dmsans">Hardware Engineering • San Francisco, CA</p>
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
          
          {jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
            <div className="col-span-full text-center text-graphite font-dmsans text-sm py-8">
              {search ? 'No jobs found matching your search.' : 'No jobs found.'}
            </div>
          )}
        </div>

        {/* Filter Modal */}
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
      </div>
    </div>
  );
};

export default Jobs;
