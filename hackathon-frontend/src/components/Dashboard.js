import React, { useState, useEffect } from 'react';
import { 
  FaSuitcase, 
  FaUsers, 
  FaChartBar, 
  FaClipboardCheck 
} from 'react-icons/fa';
import authService from '../services/authService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    recentApplicants: [],
    topRatedApplicants: [],
    jobStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs and applicants data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch job offers
        const jobsResponse = await fetch('http://localhost:5000/api/job_offers', {
          headers: {
            ...authService.authHeader()
          }
        });

        // Fetch applicants
        const applicantsResponse = await fetch('http://localhost:5000/api/applicants', {
          headers: {
            ...authService.authHeader()
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
    };

    fetchDashboardData();
  }, []);

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
          <FaUsers className="text-green-500 text-4xl mr-4" />
          <div>
            <h3 className="text-gray-500 text-sm">Total Applicants</h3>
            <p className="text-2xl font-bold">{dashboardData.totalApplicants}</p>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaChartBar className="text-purple-500 text-4xl mr-4" />
          <div>
            <h3 className="text-gray-500 text-sm">Open Positions</h3>
            <p className="text-2xl font-bold">
              {dashboardData.jobStats.filter(job => job.status === 'open').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaClipboardCheck className="text-orange-500 text-4xl mr-4" />
          <div>
            <h3 className="text-gray-500 text-sm">Closed Positions</h3>
            <p className="text-2xl font-bold">
              {dashboardData.jobStats.filter(job => job.status === 'closed').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Applicants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Applicants</h2>
          {dashboardData.recentApplicants.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentApplicants.map((applicant) => (
                <div 
                  key={applicant.id} 
                  className="flex justify-between items-center border-b pb-2 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{applicant.fullName}</p>
                    <p className="text-sm text-gray-500">{applicant.jobTitle}</p>
                  </div>
                  <span className="text-sm text-gray-600">{applicant.email}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No recent applicants</p>
          )}
        </div>
        
        {/* Top Rated Applicants */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Rated Applicants</h2>
          {dashboardData.topRatedApplicants.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.topRatedApplicants.map((applicant) => (
                <div 
                  key={applicant.id} 
                  className="flex justify-between items-center border-b pb-2 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{applicant.fullName}</p>
                    <p className="text-sm text-gray-500">{applicant.jobTitle}</p>
                  </div>
                  <span 
                    className={`text-sm font-bold ${
                      parseFloat(applicant.scores.overall) >= 90 
                        ? 'text-green-600' 
                        : parseFloat(applicant.scores.overall) >= 80 
                        ? 'text-blue-600' 
                        : 'text-yellow-600'
                    }`}
                  >
                    {applicant.scores.overall}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No top-rated applicants</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;