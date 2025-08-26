import React, { useEffect, useState } from 'react';
import { candidateAPI, profileAPI } from '../../services/api';
import RivianCarImage from '../../assets/rivian car.jpg';
import { Camera, Upload } from '@phosphor-icons/react';

interface AssessmentScore {
  id: string;
  instanceId: string;
  assessmentId: string;
  jobTitle: string;
  companyName: string;
  technicalAccuracy: number | null;
  problemSolving: number | null;
  communication: number | null;
  fieldSkills?: Record<string, number>;  // Dynamic field-specific skills
  status: string;
  completedAt: string;
}

const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    currentPosition: '',
    education: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await candidateAPI.getProfile();
        setProfile(data);
        
        // Initialize edit form with current data
        setEditForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          currentPosition: data.currentPosition || '',
          education: data.education || ''
        });
        
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    setEditForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      currentPosition: profile.currentPosition || '',
      education: profile.education || ''
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Sending update with data:', {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        location: editForm.currentPosition
      });
      
      // Send all form data to the permissive backend
      console.log('Sending form data:', editForm);
      const updatedProfile = await profileAPI.updateCandidateProfile(editForm);
      
      console.log('API returned updated profile:', updatedProfile);
      
      // Update local state with the returned data
      setProfile(updatedProfile);
      
      // Also update the edit form with the new data
      setEditForm({
        firstName: updatedProfile.firstName || '',
        lastName: updatedProfile.lastName || '',
        currentPosition: updatedProfile.currentPosition || updatedProfile.location || '',
        education: updatedProfile.education || ''
      });
      
      // Refresh profile data from server to ensure we have the latest
      try {
        const freshProfile = await candidateAPI.getProfile();
        setProfile(freshProfile);
        console.log('Refreshed profile from server:', freshProfile);
      } catch (refreshErr) {
        console.error('Error refreshing profile:', refreshErr);
      }
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingPicture(true);
      const result = await profileAPI.uploadProfilePicture(file);
      
      // Update profile with new picture URL
      setProfile(prev => ({
        ...prev,
        profilePicture: result.profilePicture
      }));
      
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
    }
  };

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

  // Format skill names from snake_case to Title Case
  const formatSkillName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Check if assessment has field-specific skills
  const hasFieldSkills = (assessment: AssessmentScore) => {
    return assessment.fieldSkills && Object.keys(assessment.fieldSkills).length > 0;
  };

  // Get field-specific skills
  const getFieldSkills = (assessment: AssessmentScore) => {
    if (!assessment.fieldSkills) return [];
    return Object.entries(assessment.fieldSkills).map(([name, score]) => ({
      name: formatSkillName(name),
      score
    }));
  };

  if (loading) return <div className="text-gray-900">Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!profile) return <div className="text-gray-900">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Candidate Profile</h1>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img 
                src={profile?.profilePicture || RivianCarImage} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-violet rounded-full flex items-center justify-center cursor-pointer hover:bg-corePurple transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                disabled={uploadingPicture}
              />
              <Camera className="h-4 w-4 text-white" weight="bold" />
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Upload a new profile picture. The image will be resized automatically.
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
            {uploadingPicture && (
              <p className="text-xs text-violet mt-2">Uploading...</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Basic Profile Information */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email || profile.user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Position
                  </label>
                  <input
                    type="text"
                    value={editForm.currentPosition}
                    onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <textarea
                    value={editForm.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
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
        )}
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

                {/* Field-Specific Skills */}
                {hasFieldSkills(assessment) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Field-Specific Skills</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {getFieldSkills(assessment).map((fieldScore, index) => (
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