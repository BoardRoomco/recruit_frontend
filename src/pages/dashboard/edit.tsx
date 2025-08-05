import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  assessmentLink?: string;
  assessmentField?: string;
  status: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    description?: string;
    website?: string;
  };
}

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    assessmentLink: '',
    assessmentField: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const jobData = await jobsAPI.getById(id);
        setJob(jobData);
        setFormData({
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.requirements || '',
          assessmentLink: jobData.assessmentLink || '',
          assessmentField: (jobData as any).assessmentField || '',
          status: jobData.status
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError('');

    try {
      await jobsAPI.update(id, formData);
      navigate(`/dashboard/jobs/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
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
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link to={`/dashboard/jobs/${job.id}`} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      Job Details
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500">Edit Job</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-600 mt-2">Update the details for "{job.title}"</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="List the skills, experience, and qualifications required for this position..."
              />
            </div>

            {/* Assessment Link */}
            <div>
              <label htmlFor="assessmentLink" className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Link
              </label>
              <input
                type="url"
                id="assessmentLink"
                name="assessmentLink"
                value={formData.assessmentLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/assessment"
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Provide a link to an assessment or test that candidates should complete.
              </p>
            </div>

            {/* Assessment Field */}
            <div>
              <label htmlFor="assessmentField" className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Field
              </label>
              <select
                id="assessmentField"
                name="assessmentField"
                value={formData.assessmentField}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a field (optional)</option>
                <option value="electrical">Electrical Engineering</option>
                <option value="mechanical">Mechanical Engineering</option>
                <option value="software">Software Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="chemical">Chemical Engineering</option>
                <option value="biomedical">Biomedical Engineering</option>
                <option value="aerospace">Aerospace Engineering</option>
                <option value="industrial">Industrial Engineering</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Optional: Select the engineering field for specialized skill assessment.
              </p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                to={`/dashboard/jobs/${job.id}`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob; 