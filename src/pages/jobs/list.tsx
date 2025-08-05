import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, type Job } from '../../services/api';

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobsAPI.getAll();
        setJobs(data.jobs);
      } catch (err) {
        setError('Failed to load jobs');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          <p className="mt-2 text-gray-600">Find your next career opportunity</p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-600">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="hover:text-indigo-600 transition-colors duration-200"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{job.company.name}</p>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {job.description.length > 150 
                      ? `${job.description.substring(0, 150)}...` 
                      : job.description
                    }
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                    <span className="text-xs text-gray-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;