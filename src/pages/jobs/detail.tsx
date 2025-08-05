import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../../services/api';
import type { Job } from '../../services/api';
import ApplyOverlay from '../../components/ApplyOverlay';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyOverlay, setShowApplyOverlay] = useState(false);
  const [applying, setApplying] = useState(false);

  console.log('JobDetail render - showApplyOverlay:', showApplyOverlay);

  // Fetch job details from API
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('Job ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const jobData = await jobsAPI.getById(id);
        setJob(jobData);
      } catch (err: any) {
        console.error('Error fetching job:', err);
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplySubmit = async (coverLetter: string) => {
    if (!isAuthenticated) {
      alert('Please log in to apply for this job');
      navigate('/login');
      return;
    }

    if (!job) {
      alert('Job information not available');
      return;
    }

    try {
      setApplying(true);
      console.log('Submitting application for job:', job.id);
      console.log('Cover letter:', coverLetter);
      
      const result = await applicationsAPI.apply(job.id, coverLetter);
      console.log('Application submitted successfully:', result);
      
      // Show success message
      alert('Application submitted successfully!');
      setShowApplyOverlay(false);
    } catch (err: any) {
      console.error('Error submitting application:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit application';
      alert(`Error: ${errorMessage}`);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Debug Info */}
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm">Debug: showApplyOverlay = {showApplyOverlay.toString()}</p>
          <p className="text-sm">Auth: isAuthenticated = {isAuthenticated?.toString()}</p>
          <p className="text-sm">User Role: {user?.role}</p>
          <button 
            onClick={() => setShowApplyOverlay(!showApplyOverlay)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Toggle Overlay
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/jobs" className="text-gray-500 hover:text-gray-700">
                  Jobs
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">Job Details</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-600 mt-2">Posted by {job.company.name}</p>
            </div>
            <div className="flex space-x-3">
              {/* Show Apply button for authenticated candidates */}
              {isAuthenticated && user?.role === 'candidate' && (
                <button
                  onClick={() => {
                    console.log('=== APPLY BUTTON CLICKED ===');
                    console.log('Current showApplyOverlay state:', showApplyOverlay);
                    console.log('Setting showApplyOverlay to true');
                    setShowApplyOverlay(true);
                    console.log('Apply overlay should now be visible');
                  }}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Apply Now
                </button>
              )}
              
              {/* Show login prompt for unauthenticated users */}
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login to Apply
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Job Information</h2>
          </div>
          
          <div className="px-6 py-4 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Posted</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Requirements</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Assessment Link */}
            {job.assessmentLink && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Assessment Link</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <a
                    href={job.assessmentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 underline"
                  >
                    {job.assessmentLink}
                  </a>
                </div>
              </div>
            )}

            {/* Company Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Company Information</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.company.name}</p>
                    {job.company.description && (
                      <p className="text-sm text-gray-600 mt-1">{job.company.description}</p>
                    )}
                  </div>
                  {job.company.website && (
                    <div className="text-right">
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start">
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </Link>
        </div>
      </div>

      {/* Apply Overlay Component */}
      <ApplyOverlay
        isVisible={showApplyOverlay}
        onClose={() => setShowApplyOverlay(false)}
        jobTitle={job.title}
        onSubmit={handleApplySubmit}
        applying={applying}
      />
    </div>
  );
};

export default JobDetail;