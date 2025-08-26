import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import { Job, AssessmentScore } from '../../types/assessment';

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  experience: string;
  education: string;
  email: string;
  colareScore: number;
  skills: {
    technical: number;
    problemSolving: number;
    communication: number;
    fieldSkills?: Record<string, number>;  // Add field-specific skills
  };
  time: string;
  date: string;
  status: 'recommended' | 'review-again' | 'not-interested';
  hasAssessment: boolean;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobAndCandidates = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Hardcoded job data for Sr. Battery Test Technician III
        if (id === '1') {
          const fakeJob: Job = {
            id: '1',
            title: 'Sr. Battery Test Technician III',
            description: 'Lead battery testing and validation for electric vehicle systems. Work with cutting-edge battery technology and ensure quality standards for Rivian\'s electric vehicles.',
            requirements: 'Bachelor\'s degree in Electrical Engineering, Mechanical Engineering, or related field. 5+ years of experience in battery testing and validation. Experience with high-voltage systems and safety protocols.',
            assessmentLink: '/assessment/battery-test',
            assessmentField: 'electrical',
            status: 'active',
            companyId: 'rivian-1',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            company: {
              id: 'rivian-1',
              name: 'Rivian',
              description: 'Electric vehicle manufacturer',
              website: 'https://rivian.com'
            },
            _count: {
              applications: 260
            }
          };
          
          // Hardcoded candidate data with many more candidates
          const fakeCandidates: Candidate[] = [
            {
              id: '1',
              name: 'Ahmed Osman',
              avatar: 'AO',
              experience: '7 years',
              education: 'Stanford University',
              email: 'ahmed.osman@email.com',
              colareScore: 94,
              skills: { technical: 96, problemSolving: 92, communication: 94 },
              time: '2 days ago',
              date: '2024-01-20',
              status: 'recommended',
              hasAssessment: true
            },
            { id: '2', name: 'Sarah Chen', avatar: 'SC', experience: '6 years', education: 'UC Berkeley', email: 'sarah.chen@email.com', colareScore: 91, skills: { technical: 93, problemSolving: 89, communication: 91 }, time: '3 days ago', date: '2024-01-19', status: 'recommended', hasAssessment: true },
            { id: '3', name: 'Marcus Rodriguez', avatar: 'MR', experience: '8 years', education: 'MIT', email: 'marcus.rodriguez@email.com', colareScore: 89, skills: { technical: 91, problemSolving: 88, communication: 89 }, time: '4 days ago', date: '2024-01-18', status: 'recommended', hasAssessment: true },
            { id: '4', name: 'Jennifer Liu', avatar: 'JL', experience: '5 years', education: 'Caltech', email: 'jennifer.liu@email.com', colareScore: 87, skills: { technical: 89, problemSolving: 86, communication: 87 }, time: '5 days ago', date: '2024-01-17', status: 'review-again', hasAssessment: true },
            { id: '5', name: 'David Park', avatar: 'DP', experience: '4 years', education: 'UCLA', email: 'david.park@email.com', colareScore: 84, skills: { technical: 86, problemSolving: 83, communication: 84 }, time: '6 days ago', date: '2024-01-16', status: 'review-again', hasAssessment: true },
            { id: '6', name: 'Maria Garcia', avatar: 'MG', experience: '6 years', education: 'Georgia Tech', email: 'maria.garcia@email.com', colareScore: 82, skills: { technical: 84, problemSolving: 81, communication: 82 }, time: '1 week ago', date: '2024-01-15', status: 'review-again', hasAssessment: true },
            { id: '7', name: 'James Wilson', avatar: 'JW', experience: '5 years', education: 'Carnegie Mellon', email: 'james.wilson@email.com', colareScore: 80, skills: { technical: 82, problemSolving: 79, communication: 80 }, time: '1 week ago', date: '2024-01-14', status: 'review-again', hasAssessment: true },
            { id: '8', name: 'Priya Patel', avatar: 'PP', experience: '7 years', education: 'University of Michigan', email: 'priya.patel@email.com', colareScore: 88, skills: { technical: 90, problemSolving: 87, communication: 88 }, time: '1 week ago', date: '2024-01-13', status: 'recommended', hasAssessment: true },
            { id: '9', name: 'Robert Kim', avatar: 'RK', experience: '4 years', education: 'UCSD', email: 'robert.kim@email.com', colareScore: 78, skills: { technical: 80, problemSolving: 77, communication: 78 }, time: '1 week ago', date: '2024-01-12', status: 'not-interested', hasAssessment: true },
            { id: '10', name: 'Emily Zhang', avatar: 'EZ', experience: '6 years', education: 'Northwestern', email: 'emily.zhang@email.com', colareScore: 85, skills: { technical: 87, problemSolving: 84, communication: 85 }, time: '1 week ago', date: '2024-01-11', status: 'review-again', hasAssessment: true },
            { id: '11', name: 'Michael Brown', avatar: 'MB', experience: '8 years', education: 'Purdue', email: 'michael.brown@email.com', colareScore: 83, skills: { technical: 85, problemSolving: 82, communication: 83 }, time: '1 week ago', date: '2024-01-10', status: 'review-again', hasAssessment: true },
            { id: '12', name: 'Lisa Thompson', avatar: 'LT', experience: '5 years', education: 'UT Austin', email: 'lisa.thompson@email.com', colareScore: 81, skills: { technical: 83, problemSolving: 80, communication: 81 }, time: '2 weeks ago', date: '2024-01-09', status: 'review-again', hasAssessment: true },
            { id: '13', name: 'Kevin Lee', avatar: 'KL', experience: '3 years', education: 'UC Irvine', email: 'kevin.lee@email.com', colareScore: 76, skills: { technical: 78, problemSolving: 75, communication: 76 }, time: '2 weeks ago', date: '2024-01-08', status: 'not-interested', hasAssessment: true },
            { id: '14', name: 'Anna Petrov', avatar: 'AP', experience: '7 years', education: 'Virginia Tech', email: 'anna.petrov@email.com', colareScore: 86, skills: { technical: 88, problemSolving: 85, communication: 86 }, time: '2 weeks ago', date: '2024-01-07', status: 'recommended', hasAssessment: true },
            { id: '15', name: 'Daniel Martinez', avatar: 'DM', experience: '4 years', education: 'Arizona State', email: 'daniel.martinez@email.com', colareScore: 79, skills: { technical: 81, problemSolving: 78, communication: 79 }, time: '2 weeks ago', date: '2024-01-06', status: 'not-interested', hasAssessment: true },
            { id: '16', name: 'Rachel Johnson', avatar: 'RJ', experience: '6 years', education: 'Penn State', email: 'rachel.johnson@email.com', colareScore: 84, skills: { technical: 86, problemSolving: 83, communication: 84 }, time: '2 weeks ago', date: '2024-01-05', status: 'review-again', hasAssessment: true },
            { id: '17', name: 'Alex Chen', avatar: 'AC', experience: '5 years', education: 'UC Davis', email: 'alex.chen@email.com', colareScore: 82, skills: { technical: 84, problemSolving: 81, communication: 82 }, time: '2 weeks ago', date: '2024-01-04', status: 'review-again', hasAssessment: true },
            { id: '18', name: 'Samantha Taylor', avatar: 'ST', experience: '7 years', education: 'Oregon State', email: 'samantha.taylor@email.com', colareScore: 87, skills: { technical: 89, problemSolving: 86, communication: 87 }, time: '2 weeks ago', date: '2024-01-03', status: 'recommended', hasAssessment: true },
            { id: '19', name: 'Ryan Murphy', avatar: 'RM', experience: '3 years', education: 'Colorado State', email: 'ryan.murphy@email.com', colareScore: 75, skills: { technical: 77, problemSolving: 74, communication: 75 }, time: '3 weeks ago', date: '2024-01-02', status: 'not-interested', hasAssessment: true },
            { id: '20', name: 'Grace Wong', avatar: 'GW', experience: '6 years', education: 'Washington State', email: 'grace.wong@email.com', colareScore: 83, skills: { technical: 85, problemSolving: 82, communication: 83 }, time: '3 weeks ago', date: '2024-01-01', status: 'review-again', hasAssessment: true }
          ];
          
          setJob(fakeJob);
          setCandidates(fakeCandidates);
        } else {
          // For other job IDs, show a basic job structure
          setJob({
            id: id,
            title: 'Job Details',
            description: 'Job details will be available soon.',
            requirements: 'Requirements will be available soon.',
            status: 'active',
            companyId: 'rivian-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            company: {
              id: 'rivian-1',
              name: 'Rivian',
              description: 'Electric vehicle manufacturer'
            },
            _count: {
              applications: 0
            }
          });
          setCandidates([]);
        }
        
      } catch (err: any) {
        console.error('Error loading job details:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndCandidates();
  }, [id]);

  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.education.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => b.colareScore - a.colareScore); // Sort by colare score in descending order

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended':
        return 'bg-green-100 text-green-800';
      case 'review-again':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-interested':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recommended':
        return 'Recommended';
      case 'review-again':
        return 'Review Again';
      case 'not-interested':
        return 'Not Interested';
      default:
        return status;
    }
  };

  // Add helper function to format skill names
  const formatSkillName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Add field skills section to candidate display
  const renderFieldSkills = (skills: Record<string, number>) => {
    if (!skills || Object.keys(skills).length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Field-Specific Skills</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(skills).map(([skillName, score], index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-600 mb-1">{formatSkillName(skillName)}</div>
              <div className={`text-sm font-semibold ${getScoreColor(score)}`}>
                {formatScore(score)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add helper function to format score
  const formatScore = (score: number) => {
    return `${score}%`;
  };

  // Add helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
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
          <h2 className="text-2xl font-fustat font-bold text-graphite mb-4">Job Not Found</h2>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </Link>
          
          <div className="mb-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-gray-600 text-lg">
                  Hardware Engineering • San Francisco, CA
                </p>
              </div>
              <Link
                to={`/dashboard/jobs/${job.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Edit Job
              </Link>
            </div>
            <div className="flex items-center space-x-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700">
                  Closed
                </span>
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm">{filteredCandidates.filter(c => c.colareScore > 0).length}/{filteredCandidates.length} candidates assessed</span>
              </div>
            </div>
            


          </div>
          
          <p className="text-gray-700 mt-4 max-w-3xl">
            {job.description}
          </p>
        </div>

        {/* Candidate Leaderboard */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Candidate Leaderboard</h2>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              


              <button 
                onClick={() => {
                  // Create CSV content
                  const headers = ['Name', 'Colare Score', 'Technical', 'Problem Solving', 'Communication', 'Time'];
                  const csvContent = [
                    headers.join(','),
                    ...filteredCandidates.map(candidate => [
                      `"${candidate.name}"`,
                      candidate.colareScore,
                      candidate.skills.technical,
                      candidate.skills.problemSolving,
                      candidate.skills.communication,
                      `"${candidate.time}"`
                    ].join(','))
                  ].join('\n');
                  
                  // Create and download file
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${job?.title || 'candidates'}_export.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    colare Score
                  </th>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Technical
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Problem Solving
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Communication
                   </th>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{candidate.avatar}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link 
                            to={`/dashboard/jobs/${id}/candidates/${candidate.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer"
                          >
                            {candidate.name}
                          </Link>
                          <div className="text-xs text-gray-400">
                            {candidate.education}
                          </div>
                          <div className="text-xs text-gray-400">
                            {candidate.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidate.colareScore}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getScoreColor(candidate.skills.technical)}`}>
                        {formatScore(candidate.skills.technical)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getScoreColor(candidate.skills.problemSolving)}`}>
                        {formatScore(candidate.skills.problemSolving)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getScoreColor(candidate.skills.communication)}`}>
                        {formatScore(candidate.skills.communication)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/dashboard/jobs/${id}/candidates/${candidate.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;