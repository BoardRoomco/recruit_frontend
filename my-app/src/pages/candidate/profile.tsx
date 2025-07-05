import React, { useEffect, useState } from 'react';
import { candidateAPI } from '../../services/api';

interface AssessmentScore {
  id: string;
  instanceId: string;
  assessmentId: string;
  jobTitle: string;
  companyName: string;
  technicalAccuracy: number | null;
  problemSolving: number | null;
  communication: number | null;
  // Field-specific scores for electrical engineering
  circuitDesign?: number | null;
  powerSystems?: number | null;
  controlSystems?: number | null;
  electronics?: number | null;
  signalProcessing?: number | null;
  status: string;
  completedAt: string;
}

const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await candidateAPI.getProfile();
        setProfile(data);
        
        // Fetch assessment scores
        console.log('Fetching assessment scores...');
        const scoresData = await candidateAPI.getAssessmentScores();
        console.log('Assessment scores response:', scoresData);
        setAssessmentScores(scoresData.assessmentScores || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatScore = (score: number | null) => {
    if (score === null) return 'N/A';
    return `${(score * 100).toFixed(1)}%`;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Check if assessment has field-specific scores
  const hasFieldScores = (assessment: AssessmentScore) => {
    return assessment.circuitDesign !== undefined || 
           assessment.powerSystems !== undefined || 
           assessment.controlSystems !== undefined || 
           assessment.electronics !== undefined || 
           assessment.signalProcessing !== undefined;
  };

  // Get field-specific scores (including null values like main scores)
  const getFieldScores = (assessment: AssessmentScore) => {
    const fieldScores = [];
    // Always include all field-specific scores, even if null
    fieldScores.push({ name: 'Circuit Design', score: assessment.circuitDesign ?? null });
    fieldScores.push({ name: 'Power Systems', score: assessment.powerSystems ?? null });
    fieldScores.push({ name: 'Control Systems', score: assessment.controlSystems ?? null });
    fieldScores.push({ name: 'Electronics', score: assessment.electronics ?? null });
    fieldScores.push({ name: 'Signal Processing', score: assessment.signalProcessing ?? null });
    return fieldScores;
  };

  if (loading) return <div className="text-gray-900">Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!profile) return <div className="text-gray-900">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Candidate Profile</h1>
      
      {/* Basic Profile Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-gray-900">
            <div><strong>First Name:</strong> {profile.firstName || 'Not set'}</div>
            <div><strong>Last Name:</strong> {profile.lastName || 'Not set'}</div>
            <div><strong>Email:</strong> {profile.email || profile.user?.email || 'Not set'}</div>
          </div>
          <div className="space-y-2 text-gray-900">
            <div><strong>Current Position:</strong> {profile.currentPosition || 'Not set'}</div>
            <div><strong>Education:</strong> {profile.education || 'Not set'}</div>
          </div>
        </div>
      </div>

      {/* Assessment Scores Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Assessment Scores</h2>
        
        {assessmentScores.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p>No assessment scores available yet.</p>
            <p className="text-sm">Complete assessments to see your scores here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessmentScores.map((assessment) => (
              <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{assessment.jobTitle}</h3>
                    <p className="text-gray-600 text-sm">{assessment.companyName}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Completed
                  </span>
                </div>
                
                {/* Main Assessment Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Technical Accuracy</div>
                    <div className={`text-lg font-semibold ${getScoreColor(assessment.technicalAccuracy)}`}>
                      {formatScore(assessment.technicalAccuracy)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Problem Solving</div>
                    <div className={`text-lg font-semibold ${getScoreColor(assessment.problemSolving)}`}>
                      {formatScore(assessment.problemSolving)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Communication</div>
                    <div className={`text-lg font-semibold ${getScoreColor(assessment.communication)}`}>
                      {formatScore(assessment.communication)}
                    </div>
                  </div>
                </div>

                {/* Field-Specific Scores */}
                {hasFieldScores(assessment) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Field-Specific Skills</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {getFieldScores(assessment).map((fieldScore, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-gray-600 mb-1">{fieldScore.name}</div>
                          <div className={`text-sm font-semibold ${getScoreColor(fieldScore.score)}`}>
                            {formatScore(fieldScore.score)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Assessment ID: {assessment.assessmentId} | Instance: {assessment.instanceId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Statistics */}
      {assessmentScores.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Assessment Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{assessmentScores.length}</div>
              <div className="text-sm text-blue-800">Total Assessments</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {assessmentScores.filter(a => 
                  a.technicalAccuracy && a.technicalAccuracy >= 0.8
                ).length}
              </div>
              <div className="text-sm text-green-800">High Scores (80%+)</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {assessmentScores.length > 0 ? 
                  Math.round(assessmentScores.length / 1) : 0
                }
              </div>
              <div className="text-sm text-purple-800">Completion Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;