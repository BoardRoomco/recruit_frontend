import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationsAPI, Application } from '../../services/api';
import { 
  User, 
  Briefcase, 
  Calendar, 
  Eye,
  MagnifyingGlass,
  FunnelSimple
} from '@phosphor-icons/react';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  job?: {
    id: string;
    title: string;
  };
}

const Candidates: React.FC = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        console.log('Fetching candidates for company:', user?.company?.id);
        const applications: Application[] = await applicationsAPI.getCompanyApplications();
        console.log('Applications data received:', applications);
        
        // Transform Application[] to Candidate[]
        const transformedCandidates: Candidate[] = applications.map(app => ({
          id: app.candidateId,
          firstName: app.candidate?.firstName || 'Unknown',
          lastName: app.candidate?.lastName || 'Unknown',
          email: 'email@example.com', // Application doesn't have email, using placeholder
          status: app.status,
          createdAt: app.createdAt,
          job: app.job ? {
            id: app.job.id,
            title: app.job.title
          } : undefined
        }));
        
        console.log('Transformed candidates:', transformedCandidates);
        setCandidates(transformedCandidates);
      } catch (err: any) {
        console.error('Failed to load candidates:', err);
        console.error('Error details:', err.response?.data || err.message);
        // Set empty array on error to prevent crashes
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.company?.id) {
      fetchCandidates();
    } else {
      console.log('No company ID found, user:', user);
      setLoading(false);
    }
  }, [user?.company?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-softLavender flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-violet rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <User className="h-8 w-8 text-white" weight="regular" />
          </div>
          <h2 className="text-2xl font-fustat font-bold text-graphite mb-2">Loading Candidates</h2>
          <p className="text-graphite font-dmsans">Fetching candidate data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softLavender">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-fustat font-bold text-graphite mb-2">Candidates</h1>
          <p className="text-graphite font-dmsans text-lg">Manage and review all candidate applications</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-graphite font-dmsans text-sm focus:outline-none focus:ring-1 focus:ring-violet"
                />
              </div>
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-graphite font-dmsans text-sm shadow-sm hover:bg-gray-50 transition"
                onClick={() => setFilterOpen(true)}
              >
                <FunnelSimple size={18} className="text-gray-500" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates && candidates.length > 0 ? (
            candidates
              .filter(candidate => 
                candidate.firstName.toLowerCase().includes(search.toLowerCase()) ||
                candidate.lastName.toLowerCase().includes(search.toLowerCase()) ||
                candidate.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-softLavender rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-violet">
                          {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-fustat font-bold text-graphite">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 font-dmsans">{candidate.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium font-dmsans ${
                      candidate.status === 'submitted' ? 'bg-yellow-50 text-yellow-700' :
                      candidate.status === 'reviewed' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {candidate.status}
                    </span>
                  </div>
                  
                  {candidate.job && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-dmsans">
                        <Briefcase size={14} className="text-gray-400" />
                        {candidate.job.title}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-dmsans">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </div>
                    <Link
                      to={`/dashboard/jobs/${candidate.job?.id || 'unknown'}/candidates/${candidate.id}`}
                      className="flex items-center gap-1 text-xs text-violet hover:text-corePurple font-dmsans font-medium transition"
                    >
                      <Eye size={14} />
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-full text-center text-graphite font-dmsans text-sm py-8">
              {loading ? 'Loading candidates...' : 'No candidates found.'}
            </div>
          )}
          
          {candidates && candidates.length > 0 && candidates.filter(candidate => 
            candidate.firstName.toLowerCase().includes(search.toLowerCase()) ||
            candidate.lastName.toLowerCase().includes(search.toLowerCase()) ||
            candidate.email.toLowerCase().includes(search.toLowerCase())
          ).length === 0 && (
            <div className="col-span-full text-center text-graphite font-dmsans text-sm py-8">
              No candidates found matching your search.
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
              <h3 className="text-lg font-fustat font-bold text-graphite mb-4">Filter Candidates</h3>
              <p className="text-graphite font-dmsans mb-6">(Filter options coming soon!)</p>
              <button
                className="px-4 py-2 rounded-full bg-gray-100 text-graphite font-dmsans font-medium hover:bg-gray-200 transition"
                onClick={() => setFilterOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
