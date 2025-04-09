import React, { useState, useEffect } from 'react';
import { 
  FaSuitcase, 
  FaUsers, 
  FaChartBar, 
  FaClipboardCheck,
  FaStar,
  FaClipboardList,
  FaUserTie,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    recentApplicants: [],
    topRatedApplicants: [],
    jobStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we're in demo mode
  useEffect(() => {
    setIsDemoMode(location.pathname.startsWith('/demo'));
  }, [location]);

  // Fetch jobs and applicants data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (isDemoMode) {
          // Use mock data for demo mode
          setTimeout(() => {
            setDashboardData({
              totalJobs: 12,
              totalApplicants: 48,
              recentApplicants: [
                { id: 1, fullName: 'John Smith', jobTitle: 'Senior Developer', email: 'john.smith@example.com' },
                { id: 2, fullName: 'Emily Johnson', jobTitle: 'UX Designer', email: 'emily.j@example.com' },
                { id: 3, fullName: 'Michael Brown', jobTitle: 'Product Manager', email: 'michael.b@example.com' },
                { id: 4, fullName: 'Sarah Davis', jobTitle: 'Data Scientist', email: 'sarah.d@example.com' },
                { id: 5, fullName: 'David Wilson', jobTitle: 'Frontend Developer', email: 'david.w@example.com' }
              ],
              topRatedApplicants: [
                { id: 6, fullName: 'Jennifer Lee', jobTitle: 'Full Stack Developer', email: 'jennifer.l@example.com', scores: { overall: 95 } },
                { id: 7, fullName: 'Robert Taylor', jobTitle: 'DevOps Engineer', email: 'robert.t@example.com', scores: { overall: 92 } },
                { id: 8, fullName: 'Lisa Anderson', jobTitle: 'UI Designer', email: 'lisa.a@example.com', scores: { overall: 90 } },
                { id: 9, fullName: 'James Martin', jobTitle: 'Backend Developer', email: 'james.m@example.com', scores: { overall: 88 } },
                { id: 10, fullName: 'Patricia White', jobTitle: 'QA Engineer', email: 'patricia.w@example.com', scores: { overall: 85 } }
              ],
              jobStats: [
                { id: 1, title: 'Senior Developer', status: 'open', closingDate: '2023-12-31' },
                { id: 2, title: 'UX Designer', status: 'open', closingDate: '2023-12-15' },
                { id: 3, title: 'Product Manager', status: 'closed', closingDate: '2023-11-30' },
                { id: 4, title: 'Data Scientist', status: 'open', closingDate: '2023-12-20' },
                { id: 5, title: 'Frontend Developer', status: 'open', closingDate: '2023-12-10' },
                { id: 6, title: 'Full Stack Developer', status: 'closed', closingDate: '2023-11-15' },
                { id: 7, title: 'DevOps Engineer', status: 'open', closingDate: '2023-12-25' },
                { id: 8, title: 'UI Designer', status: 'open', closingDate: '2023-12-05' },
                { id: 9, title: 'Backend Developer', status: 'closed', closingDate: '2023-11-20' },
                { id: 10, title: 'QA Engineer', status: 'open', closingDate: '2023-12-18' },
                { id: 11, title: 'Mobile Developer', status: 'open', closingDate: '2023-12-22' },
                { id: 12, title: 'Project Manager', status: 'closed', closingDate: '2023-11-25' }
              ]
            });
            setLoading(false);
          }, 1000); // Simulate loading delay
        } else {
          // In a real app, we would fetch data from the API
          try {
            // Fetch job offers
            const jobsResponse = await fetch('http://localhost:5000/api/job_offers', {
              headers: {
                // authService.authHeader() would be used here
              }
            });

            // Fetch applicants
            const applicantsResponse = await fetch('http://localhost:5000/api/applicants', {
              headers: {
                // authService.authHeader() would be used here
              }
            });

            if (!jobsResponse.ok || !applicantsResponse.ok) {
              throw new Error('Failed to fetch dashboard data');
            }

            const jobsData = await jobsResponse.json();
            const applicantsData = await applicantsResponse.json();

            // Process jobs data
            const jobStats = jobsData.map(job => ({
              id: job.id,
              title: job.job_title,
              status: job.closing_date ? 
                (new Date(job.closing_date) < new Date() ? 'closed' : 'open') 
                : 'open',
              closingDate: job.closing_date
            }));

            // Process applicants data
            const sortedApplicants = applicantsData.sort((a, b) => 
              parseFloat(b.scores.overall) - parseFloat(a.scores.overall)
            );

            setDashboardData({
              totalJobs: jobsData.length,
              totalApplicants: applicantsData.length,
              recentApplicants: applicantsData.slice(0, 5), // Most recently added
              topRatedApplicants: sortedApplicants.slice(0, 5), // Top 5 by score
              jobStats: jobStats
            });

            setError(null);
          } catch (err) {
            setError("Error loading dashboard: " + err.message);
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
      } catch (err) {
        setError("Error loading dashboard: " + err.message);
        console.error(err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isDemoMode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Recruitment Dashboard</h1>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaSuitcase className="text-blue-500 text-4xl mr-4" />
          <div>
            <h3 className="text-gray-500 text-sm">Total Jobs</h3>
            <p className="text-2xl font-bold">{dashboardData.totalJobs}</p>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaUserTie className="text-green-500 text-4xl mr-4" />
          <div>
            <h3 className="text-gray-500 text-sm">Total Applicants</h3>
            <p className="text-2xl font-bold">{dashboardData.totalApplicants}</p>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaChartLine className="text-purple-500 text-4xl mr-4" />
          <div>
            <h3 className="text-gray-500 text-sm">Open Positions</h3>
            <p className="text-2xl font-bold">
              {dashboardData.jobStats.filter(job => job.status === 'open').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaCheckCircle className="text-orange-500 text-4xl mr-4" />
          <div>
            <h3 className="text-gray-500 text-sm">Closed Positions</h3>
            <p className="text-2xl font-bold">
              {dashboardData.jobStats.filter(job => job.status === 'closed').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Applicants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FaUsers className="mr-2 text-blue-500" />
            Recent Applicants
          </h2>
          {dashboardData.recentApplicants.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentApplicants.map((applicant) => (
                <div 
                  key={applicant.id} 
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{applicant.fullName}</p>
                    <p className="text-sm text-gray-500">{applicant.jobTitle}</p>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{applicant.email}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent applicants</p>
          )}
        </div>
        
        {/* Top Rated Applicants */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FaStar className="mr-2 text-yellow-500" />
            Top Rated Applicants
          </h2>
          {dashboardData.topRatedApplicants.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.topRatedApplicants.map((applicant) => (
                <div 
                  key={applicant.id} 
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{applicant.fullName}</p>
                    <p className="text-sm text-gray-500">{applicant.jobTitle}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {applicant.scores?.overall || 'N/A'}%
                    </span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{applicant.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No top rated applicants</p>
          )}
        </div>
      </div>
      
      {/* Job Status */}
      <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          Job Status
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Closing Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.jobStats.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      {job.closingDate ? new Date(job.closingDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;