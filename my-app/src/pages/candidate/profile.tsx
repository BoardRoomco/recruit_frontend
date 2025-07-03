import React, { useEffect, useState } from 'react';
import { candidateAPI } from '../../services/api';

const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await candidateAPI.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-gray-900">Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!profile) return <div className="text-gray-900">Profile not found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Candidate Profile</h1>
      <div className="space-y-2 text-gray-900">
        <div><strong>First Name:</strong> {profile.firstName || 'Not set'}</div>
        <div><strong>Last Name:</strong> {profile.lastName || 'Not set'}</div>
        <div><strong>Email:</strong> {profile.email || profile.user?.email || 'Not set'}</div>
        <div><strong>Current Position:</strong> {profile.currentPosition || 'Not set'}</div>
        <div><strong>Education:</strong> {profile.education || 'Not set'}</div>
      </div>
    </div>
  );
};

export default CandidateProfile;