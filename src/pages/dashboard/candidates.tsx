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
        
        // Fake candidate data for demo
        const fakeCandidates: Candidate[] = [
          {
            id: '1',
            firstName: 'Ahmed',
            lastName: 'Osman',
            email: 'ahmed.osman@email.com',
            status: 'reviewed',
            createdAt: '2024-01-20T10:00:00Z',
            job: { id: '1', title: 'Staff Mechanical Design Engineer' }
          },
          {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Chen',
            email: 'sarah.chen@email.com',
            status: 'submitted',
            createdAt: '2024-01-19T10:00:00Z',
            job: { id: '1', title: 'Staff Mechanical Design Engineer' }
          },
          {
            id: '3',
            firstName: 'Marcus',
            lastName: 'Rodriguez',
            email: 'marcus.rodriguez@email.com',
            status: 'reviewed',
            createdAt: '2024-01-18T10:00:00Z',
            job: { id: '2', title: 'Sr. Mechanical Engineer, Mechanisms' }
          },
          {
            id: '4',
            firstName: 'Jennifer',
            lastName: 'Liu',
            email: 'jennifer.liu@email.com',
            status: 'interviewed',
            createdAt: '2024-01-17T10:00:00Z',
            job: { id: '3', title: 'Validation Engineer, Chassis' }
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Park',
            email: 'david.park@email.com',
            status: 'submitted',
            createdAt: '2024-01-16T10:00:00Z',
            job: { id: '1', title: 'Staff Mechanical Design Engineer' }
          },
          {
            id: '6',
            firstName: 'Maria',
            lastName: 'Garcia',
            email: 'maria.garcia@email.com',
            status: 'reviewed',
            createdAt: '2024-01-15T10:00:00Z',
            job: { id: '4', title: 'Controls Test Engineer' }
          },
          {
            id: '7',
            firstName: 'James',
            lastName: 'Wilson',
            email: 'james.wilson@email.com',
            status: 'submitted',
            createdAt: '2024-01-14T10:00:00Z',
            job: { id: '5', title: 'Electronics Design Industrialization Manager' }
          },
          {
            id: '8',
            firstName: 'Priya',
            lastName: 'Patel',
            email: 'priya.patel@email.com',
            status: 'interviewed',
            createdAt: '2024-01-13T10:00:00Z',
            job: { id: '2', title: 'Sr. Mechanical Engineer, Mechanisms' }
          },
          {
            id: '9',
            firstName: 'Robert',
            lastName: 'Kim',
            email: 'robert.kim@email.com',
            status: 'rejected',
            createdAt: '2024-01-12T10:00:00Z',
            job: { id: '3', title: 'Validation Engineer, Chassis' }
          },
          {
            id: '10',
            firstName: 'Emily',
            lastName: 'Zhang',
            email: 'emily.zhang@email.com',
            status: 'reviewed',
            createdAt: '2024-01-11T10:00:00Z',
            job: { id: '1', title: 'Staff Mechanical Design Engineer' }
          },
          {
            id: '11',
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'michael.brown@email.com',
            status: 'submitted',
            createdAt: '2024-01-10T10:00:00Z',
            job: { id: '4', title: 'Controls Test Engineer' }
          },
          {
            id: '12',
            firstName: 'Lisa',
            lastName: 'Thompson',
            email: 'lisa.thompson@email.com',
            status: 'interviewed',
            createdAt: '2024-01-09T10:00:00Z',
            job: { id: '5', title: 'Electronics Design Industrialization Manager' }
          },
          {
            id: '13',
            firstName: 'Kevin',
            lastName: 'Lee',
            email: 'kevin.lee@email.com',
            status: 'rejected',
            createdAt: '2024-01-08T10:00:00Z',
            job: { id: '2', title: 'Sr. Mechanical Engineer, Mechanisms' }
          },
          {
            id: '14',
            firstName: 'Anna',
            lastName: 'Petrov',
            email: 'anna.petrov@email.com',
            status: 'reviewed',
            createdAt: '2024-01-07T10:00:00Z',
            job: { id: '3', title: 'Validation Engineer, Chassis' }
          },
          {
            id: '15',
            firstName: 'Daniel',
            lastName: 'Martinez',
            email: 'daniel.martinez@email.com',
            status: 'submitted',
            createdAt: '2024-01-06T10:00:00Z',
            job: { id: '1', title: 'Staff Mechanical Design Engineer' }
          },
          {
            id: '16',
            firstName: 'Rachel',
            lastName: 'Johnson',
            email: 'rachel.johnson@email.com',
            status: 'reviewed',
            createdAt: '2024-01-05T10:00:00Z',
            job: { id: '4', title: 'Controls Test Engineer' }
          },
          {
            id: '17',
            firstName: 'Alex',
            lastName: 'Chen',
            email: 'alex.chen@email.com',
            status: 'submitted',
            createdAt: '2024-01-04T10:00:00Z',
            job: { id: '5', title: 'Electronics Design Industrialization Manager' }
          },
          {
            id: '18',
            firstName: 'Samantha',
            lastName: 'Taylor',
            email: 'samantha.taylor@email.com',
            status: 'interviewed',
            createdAt: '2024-01-03T10:00:00Z',
            job: { id: '2', title: 'Sr. Mechanical Engineer, Mechanisms' }
          },
          {
            id: '19',
            firstName: 'Ryan',
            lastName: 'Murphy',
            email: 'ryan.murphy@email.com',
            status: 'rejected',
            createdAt: '2024-01-02T10:00:00Z',
            job: { id: '3', title: 'Validation Engineer, Chassis' }
          },
          {
            id: '20',
            firstName: 'Grace',
            lastName: 'Wong',
            email: 'grace.wong@email.com',
            status: 'reviewed',
            createdAt: '2024-01-01T10:00:00Z',
            job: { id: '1', title: 'Staff Mechanical Design Engineer' }
          }
        ];
        
        setCandidates(fakeCandidates);
      } catch (err: any) {
        console.error('Failed to load candidates:', err);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [user?.company?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
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

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-dmsans">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-dmsans">
                    Position Applied
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-dmsans">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-dmsans">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-dmsans">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates && candidates.length > 0 ? (
                  candidates
                    .filter(candidate => 
                      candidate.firstName.toLowerCase().includes(search.toLowerCase()) ||
                      candidate.lastName.toLowerCase().includes(search.toLowerCase()) ||
                      candidate.email.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-softLavender rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-violet">
                                {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-fustat font-bold text-graphite">
                                {candidate.firstName} {candidate.lastName}
                              </div>
                              <div className="text-sm text-gray-500 font-dmsans">{candidate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-graphite font-dmsans">
                            {candidate.job?.title || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium font-dmsans ${
                            candidate.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                            candidate.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            candidate.status === 'interviewed' ? 'bg-green-100 text-green-800' :
                            candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-dmsans">
                          {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/dashboard/jobs/${candidate.job?.id || 'unknown'}/candidates/${candidate.id}`}
                              className="text-violet hover:text-corePurple transition-colors"
                              title="View Profile"
                            >
                              <Eye size={18} />
                            </Link>
                            <button
                              onClick={() => alert(`Schedule interview with ${candidate.firstName} ${candidate.lastName}`)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Schedule Interview"
                            >
                              <Calendar size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-graphite font-dmsans text-sm">
                      {loading ? 'Loading candidates...' : 'No candidates found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Results Count */}
        {candidates && candidates.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 font-dmsans">
            Showing {candidates.filter(candidate => 
              candidate.firstName.toLowerCase().includes(search.toLowerCase()) ||
              candidate.lastName.toLowerCase().includes(search.toLowerCase()) ||
              candidate.email.toLowerCase().includes(search.toLowerCase())
            ).length} of {candidates.length} candidates
          </div>
        )}

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
