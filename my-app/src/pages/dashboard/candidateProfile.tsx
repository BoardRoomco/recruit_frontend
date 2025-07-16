import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  location: string;
  experience: string;
  education: string;
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

  // Mock candidate data - replace with actual API call
  useEffect(() => {
    const fetchCandidate = async () => {
      // Simulate API call
      setTimeout(() => {
        setCandidate({
          id: '1',
          name: 'Sarah Chen',
          avatar: 'SC',
          role: 'Senior Mechanical Engineer',
          company: 'Tesla',
          location: 'San Francisco, CA',
          experience: '6 years experience',
          education: 'MIT - Mechanical Engineering, MS',
          colareScore: 92,
          ranking: 'Top 5% of candidates',
          skills: {
            technical: 95,
            problemSolving: 88,
            communication: 93
          },
          skillCategories: [
            {
              name: 'CAD Modeling',
              percentage: 98,
              description: 'Exceptional 3D modeling skills'
            },
            {
              name: 'FMEA Analysis',
              percentage: 94,
              description: 'Strong failure mode analysis'
            },
            {
              name: 'Thermal Management',
              percentage: 92,
              description: 'Good thermal design principles'
            },
            {
              name: 'Material Selection',
              percentage: 90,
              description: 'Excellent material knowledge'
            },
            {
              name: 'Prototyping',
              percentage: 87,
              description: 'Solid prototyping experience'
            },
            {
              name: 'Design Validation',
              percentage: 85,
              description: 'Good validation processes'
            }
          ]
        });
        setLoading(false);
      }, 500);
    };

    fetchCandidate();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#594CE9] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h2>
          <p className="text-gray-600 mb-6">The candidate you are looking for does not exist.</p>
          <Link
            to={`/dashboard/jobs/${jobId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#594CE9] hover:bg-[#4D3EF0]"
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
            className="inline-flex items-center text-sm text-gray-500 hover:text-[#594CE9] mb-4 transition-colors duration-200"
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
                <p className="text-gray-600 font-['DM_Sans']">{candidate.role} at {candidate.company}</p>
              </div>

              {/* Contact & Professional Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-3 text-[#594CE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-['DM_Sans']">{candidate.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-3 text-[#594CE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  <span className="font-['DM_Sans']">{candidate.experience}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-3 text-[#594CE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className="font-['DM_Sans']">{candidate.education}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  View LinkedIn
                </button>
              </div>

              {/* Colare Score Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-['Fustat']">Colare Score</h3>
                <div className="text-center mb-3">
                  <span className="text-4xl font-bold text-[#4D3EF0]">{candidate.colareScore}</span>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-['DM_Sans']">{candidate.ranking}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#4D3EF0] h-2 rounded-full" 
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
                    <span className="text-sm font-semibold text-[#4D3EF0]">{candidate.skills.technical}%</span>
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
                    <span className="text-sm font-semibold text-[#4D3EF0]">{candidate.skills.problemSolving}%</span>
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
                    <span className="text-sm font-semibold text-[#4D3EF0]">{candidate.skills.communication}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#594CE9] h-2 rounded-full" 
                      style={{ width: `${candidate.skills.communication}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Categories */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-['Fustat']">Skill Categories</h2>
              
              <div className="space-y-6">
                {candidate.skillCategories.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 font-['DM_Sans']">{skill.name}</span>
                      <span className="text-sm font-semibold text-[#4D3EF0]">{skill.percentage}%</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile; 