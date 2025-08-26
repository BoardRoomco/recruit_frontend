import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { candidateAPI } from '../../services/api';
import ResumeModal from '../../components/ResumeModal';
import { getResumeUrl } from '../../data/resumes';
import { ChatCircle, PaperPlaneTilt, Calendar, Star } from '@phosphor-icons/react';

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
  const [resumeModal, setResumeModal] = useState<{
    isOpen: boolean;
    candidateName: string;
    resumeUrl: string;
  }>({
    isOpen: false,
    candidateName: '',
    resumeUrl: ''
  });

  // Comments state
  const [comments, setComments] = useState<string[]>([
    "Strong technical background in mechanical engineering",
    "Excellent communication skills during phone screening"
  ]);
  const [newComment, setNewComment] = useState<string>('');
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);

  // Handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  // Handle key press in comment input
  const handleCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId || !jobId) {
        setError('Missing candidate or job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Hardcoded data for Ahmed Osman (candidate ID '1')
        if (candidateId === '1' && jobId === '1') {
          const ahmedData: Candidate = {
            id: '1',
            name: 'Ahmed Osman',
            avatar: 'AO',
            role: 'Senior Battery Systems Engineer',
            company: 'Tesla (Previous)',
            location: 'Palo Alto, CA',
            experience: '7 years in battery systems and EV technology',
            education: 'MS Electrical Engineering, Stanford University',
            email: 'ahmed.osman@email.com',
            colareScore: 94,
            ranking: 'Top 1% - Highly Recommended',
            skills: {
              technical: 96,
              problemSolving: 92,
              communication: 94
            },
            skillCategories: [
              {
                name: 'Battery Testing & Validation',
                percentage: 95,
                description: 'Expert in comprehensive battery testing protocols and validation procedures'
              },
              {
                name: 'High Voltage Systems',
                percentage: 93,
                description: 'Extensive experience with high-voltage safety protocols and system design'
              },
              {
                name: 'Battery Management Systems (BMS)',
                percentage: 91,
                description: 'Deep knowledge of BMS architecture and implementation'
              },
              {
                name: 'Data Analysis & Modeling',
                percentage: 89,
                description: 'Proficient in statistical analysis and predictive modeling for battery performance'
              },
              {
                name: 'Safety Protocols & Compliance',
                percentage: 97,
                description: 'Outstanding track record in safety compliance and risk management'
              },
              {
                name: 'Team Leadership',
                percentage: 88,
                description: 'Proven ability to lead technical teams and mentor junior engineers'
              },
              {
                name: 'Project Management',
                percentage: 85,
                description: 'Experience managing complex battery development projects'
              }
            ]
          };
          
          setCandidate(ahmedData);
        } else {
          // For other candidates, show basic placeholder
          setCandidate({
            id: candidateId || 'unknown',
            name: 'Candidate Profile',
            avatar: 'CP',
            role: 'Engineer',
            company: 'Not specified',
            location: 'Not specified',
            experience: 'Experience details will be available soon',
            education: 'Education details will be available soon',
            email: 'email@example.com',
            colareScore: 0,
            ranking: 'Assessment pending',
            skills: {
              technical: 0,
              problemSolving: 0,
              communication: 0
            },
            skillCategories: []
          });
        }
        
      } catch (err: any) {
        console.error('Error loading candidate data:', err);
        setError('Failed to load candidate data');
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
          <h2 className="text-2xl font-fustat font-bold text-graphite mb-4">Error Loading Candidate</h2>
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
          <h2 className="text-2xl font-fustat font-bold text-graphite mb-4">Candidate Not Found</h2>
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
                {candidate && getResumeUrl(candidate.name) && (
                  <button 
                    onClick={() => setResumeModal({
                      isOpen: true,
                      candidateName: candidate.name,
                      resumeUrl: getResumeUrl(candidate.name)!
                    })}
                    className="w-full bg-graphite text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center font-dmsans"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Resume
                  </button>
                )}
                
                {/* Invite to Interview Button */}
                <button 
                  onClick={() => alert(`Interview invitation sent to ${candidate.name}`)}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center font-dmsans"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Invite to Interview
                </button>
                
                {/* Shortlist Button */}
                <button 
                  onClick={() => alert(`${candidate.name} has been shortlisted`)}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center font-dmsans"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Shortlist Candidate
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

            {/* Comments Section - Separate Box */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <div className="flex items-center gap-2 mb-6">
                <ChatCircle size={18} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 font-fustat">Comments & Notes</h3>
              </div>
              
              {/* Existing Comments */}
              <div className="space-y-3 mb-6">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-300">
                      <div className="flex items-start justify-between">
                        <p className="text-gray-700 font-dmsans text-sm flex-1 leading-relaxed">{comment}</p>
                        <span className="text-xs text-gray-400 font-dmsans ml-4 whitespace-nowrap">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <ChatCircle size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-dmsans text-sm">No comments yet.</p>
                  </div>
                )}
              </div>

              {/* Add Comment Section */}
              {isAddingComment ? (
                <div className="space-y-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleCommentKeyPress}
                    placeholder="Add a note about this candidate..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none font-dmsans text-sm"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setIsAddingComment(false);
                        setNewComment('');
                      }}
                      className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-dmsans"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-dmsans"
                    >
                      <PaperPlaneTilt size={14} />
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingComment(true)}
                  className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-dmsans text-sm"
                >
                  <ChatCircle size={16} />
                  Add a comment or note
                </button>
              )}
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
      
      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeModal.isOpen}
        onClose={() => setResumeModal({ isOpen: false, candidateName: '', resumeUrl: '' })}
        candidateName={resumeModal.candidateName}
        resumeUrl={resumeModal.resumeUrl}
      />
    </div>
  );
};

export default CandidateProfile; 