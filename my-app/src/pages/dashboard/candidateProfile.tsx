import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { candidateAPI } from '../../services/api';

interface CandidateData {
  id: string;
  name: string;
  email: string;
  education: string;
  currentPosition: string;
}

interface AssessmentData {
  id: string;
  instanceId: string;
  colareScore: number;
  coreScores: {
    technical: number;
    problemSolving: number;
    communication: number;
  };
  fieldSkills: Array<{
    name: string;
    score: number;
    originalName: string;
  }>;
  status: string;
  completedAt: string;
}

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  location: string;
  experience: string;
  education: string;
  email: string;
  colareScore: number;
  ranking: string;
  skills: {
    technical: number;
    problemSolving: number;
    communication: number;
  };
  skillCategories: {
    name: string;
    percentage: number;
    description: string;
  }[];
}

const CandidateProfile: React.FC = () => {
  const { jobId, candidateId } = useParams<{ jobId: string; candidateId: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId || !jobId) {
        setError('Missing candidate or job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching candidate assessment data...');
        
        const data = await candidateAPI.getCandidateAssessment(candidateId, jobId);
        console.log('Candidate assessment data received:', data);
        
        // Transform the API data to match the existing UI structure
        const transformedCandidate: Candidate = {
          id: data.candidate.id,
          name: data.candidate.name,
          avatar: data.candidate.name.split(' ').map(n => n[0]).join(''),
          role: data.candidate.currentPosition || 'Not specified',
          company: 'Not specified', // This could be enhanced later
          location: 'Not specified', // This could be enhanced later
          experience: data.candidate.currentPosition || 'Not specified',
          education: data.candidate.education || 'Not specified',
          email: data.candidate.email || 'Not specified',
          colareScore: data.assessment?.colareScore || 0,
          ranking: data.assessment ? 'Assessment completed' : 'No assessment completed',
          skills: {
            technical: data.assessment?.coreScores.technical || 0,
            problemSolving: data.assessment?.coreScores.problemSolving || 0,
            communication: data.assessment?.coreScores.communication || 0
          },
          skillCategories: data.assessment?.fieldSkills
            .filter(skill => !skill.name.toLowerCase().includes('signal processing'))
            .map(skill => ({
              name: skill.name,
              percentage: skill.score,
              description: `Score in ${skill.name.toLowerCase()}`
            })) || []
        };
        
        setCandidate(transformedCandidate);
      } catch (err: any) {
        console.error('Error fetching candidate data:', err);
        setError(err.response?.data?.message || 'Failed to load candidate data');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId, jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#594CE9] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-['DM_Sans']">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Fustat']">Error Loading Candidate</h2>
          <p className="text-gray-600 mb-6 font-['DM_Sans']">{error}</p>
          <Link
            to={`/dashboard/jobs/${jobId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#594CE9] hover:bg-[#4D3EF0] font-['DM_Sans']"
          >
            Back to Job Details
          </Link>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Fustat']">Candidate Not Found</h2>
          <p className="text-gray-600 mb-6 font-['DM_Sans']">The candidate you are looking for does not exist.</p>
          <Link
            to={`/dashboard/jobs/${jobId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#594CE9] hover:bg-[#4D3EF0] font-['DM_Sans']"
          >
            Back to Job Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            to={`/dashboard/jobs/${jobId}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-[#594CE9] mb-4 transition-colors duration-200 font-['DM_Sans']"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Mechanical Systems Engineer
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Candidate Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              {/* Candidate Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#E8E6FC] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#4D3EF0]">{candidate.avatar}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 font-['Fustat']">{candidate.name}</h1>
              </div>

              {/* Contact & Professional Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-3 text-[#594CE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className="font-['DM_Sans']">{candidate.education}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-3 text-[#594CE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-['DM_Sans']">{candidate.email || 'Not specified'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center font-['DM_Sans']">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 font-['DM_Sans']">
                  View LinkedIn
                </button>
              </div>

              {/* Colare Score Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-['Fustat']">Colare Score</h3>
                <div className="text-center mb-3">
                  <span className="text-4xl font-bold text-gray-900 font-['Fustat']">{candidate.colareScore}</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-['DM_Sans']">{candidate.ranking}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#594CE9] h-2 rounded-full" 
                    style={{ width: `${candidate.colareScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Assessment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 font-['Fustat']">Assessment Summary</h2>
              <p className="text-gray-600 mb-6 font-['DM_Sans']">Detailed performance across key competencies</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 font-['DM_Sans']">Technical Skills</span>
                    <span className="text-sm font-semibold text-gray-900">{candidate.skills.technical}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#594CE9] h-2 rounded-full" 
                      style={{ width: `${candidate.skills.technical}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 font-['DM_Sans']">Problem Solving</span>
                    <span className="text-sm font-semibold text-gray-900">{candidate.skills.problemSolving}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#594CE9] h-2 rounded-full" 
                      style={{ width: `${candidate.skills.problemSolving}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 font-['DM_Sans']">Communication</span>
                    <span className="text-sm font-semibold text-gray-900">{candidate.skills.communication}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#594CE9] h-2 rounded-full" 
                      style={{ width: `${candidate.skills.communication}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Categories */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-['Fustat']">Skill Categories</h2>
              
              {candidate.skillCategories.length > 0 ? (
                <div className="space-y-6">
                  {candidate.skillCategories.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 font-['DM_Sans']">{skill.name}</span>
                        <span className="text-sm font-semibold text-gray-900">{skill.percentage}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 font-['DM_Sans']">{skill.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-[#594CE9] h-1.5 rounded-full" 
                          style={{ width: `${skill.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-500 font-['DM_Sans']">No field-specific skills available.</p>
                  <p className="text-sm text-gray-400 font-['DM_Sans']">Field-specific skills will appear here when available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile; 