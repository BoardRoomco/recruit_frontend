import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Calendar
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [jobsData, applicationsData] = await Promise.all([
          jobsAPI.getByCompany(user?.company?.id || ''),
          applicationsAPI.getCompanyApplications()
        ]);
        setJobs(jobsData);
        setApplications(applicationsData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet mx-auto"></div>
          <p className="mt-4 text-graphite font-dmsans">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-fustat font-bold text-graphite">Company Dashboard</h1>
              <p className="text-graphite mt-2 font-dmsans">Welcome back, {user?.company?.name}</p>
            </div>
            <Link
              to="/dashboard/create"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-violet hover:bg-corePurple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-dmsans transition"
            >
              <Plus className="w-5 h-5 mr-2" weight="regular" />
              Create New Job
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-dmsans">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-softLavender rounded-xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-violet" weight="regular" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-graphite font-dmsans">Active Jobs</dt>
                    <dd className="text-2xl font-bold text-graphite font-fustat">
                      {jobs.filter(job => job.status === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-softLavender rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-violet" weight="regular" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-graphite font-dmsans">Total Applications</dt>
                    <dd className="text-2xl font-bold text-graphite font-fustat">{applications.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-softLavender rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-violet" weight="regular" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-graphite font-dmsans">Pending Reviews</dt>
                    <dd className="text-2xl font-bold text-graphite font-fustat">
                      {applications.filter(app => app.status === 'submitted').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-fustat font-bold text-graphite">Recent Job Postings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-softLavender rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-violet" weight="regular" />
                </div>
                <h3 className="text-lg font-fustat font-bold text-graphite mb-2">No jobs posted</h3>
                <p className="text-graphite font-dmsans mb-6">Get started by creating your first job posting.</p>
                <Link
                  to="/dashboard/create"
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-base font-medium rounded-full text-white bg-violet hover:bg-corePurple font-dmsans transition"
                >
                  <Plus className="w-5 h-5 mr-2" weight="regular" />
                  Create Job
                </Link>
              </div>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-graphite font-dmsans">{job.title}</h3>
                      <p className="text-sm text-gray-500 font-dmsans flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" weight="regular" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-dmsans ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-sm text-gray-500 font-dmsans">
                        {job._count?.applications || 0} applications
                      </span>
                      <Link
                        to={`/dashboard/jobs/${job.id}`}
                        className="text-violet hover:text-corePurple text-sm font-medium font-dmsans flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" weight="regular" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {jobs.length > 5 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Link
                to="/dashboard/jobs"
                className="text-violet hover:text-corePurple text-sm font-medium font-dmsans flex items-center"
              >
                View all jobs
                <ArrowRight className="w-4 h-4 ml-1" weight="regular" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-fustat font-bold text-graphite">Recent Applications</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {applications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-softLavender rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-violet" weight="regular" />
                </div>
                <h3 className="text-lg font-fustat font-bold text-graphite mb-2">No applications yet</h3>
                <p className="text-graphite font-dmsans">Applications will appear here once candidates start applying.</p>
              </div>
            ) : (
              applications.slice(0, 5).map((application) => (
                <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-graphite font-dmsans flex items-center">
                        <User className="w-4 h-4 mr-2" weight="regular" />
                        {application.candidate?.firstName} {application.candidate?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 font-dmsans">
                        Applied for {application.job?.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-dmsans ${
                        application.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {application.status}
                      </span>
                      <span className="text-sm text-gray-500 font-dmsans">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {applications.length > 5 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Link
                to="/dashboard/applications"
                className="text-violet hover:text-corePurple text-sm font-medium font-dmsans flex items-center"
              >
                View all applications
                <ArrowRight className="w-4 h-4 ml-1" weight="regular" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;