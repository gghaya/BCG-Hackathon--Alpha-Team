import React from "react";

const Dashboard = () => {
  const stats = [
    { label: "Active Job Listings", count: 1, total: 1 },
    { label: "Applications", count: 1, total: 1 },
    { label: "Storage Used", count: "0%", total: "0 / 100 MB" },
  ];

  const jobs = [
    {
      title: "Software Engineer",
      activeSince: "21/03/2025",
      applicants: 1,
    },
    // Add more jobs here
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded">
        ✅ Welcome to HR Partner - You are now logged in
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white shadow-sm text-center"
          >
            <div className="text-2xl font-semibold">{stat.count}</div>
            <div className="text-gray-600">{stat.label}</div>
            <div className="text-blue-500 mt-1 cursor-pointer">
              {stat.total} Total
            </div>
          </div>
        ))}
      </div>

      {/* Active Jobs */}
      <div className="bg-indigo-100 border border-indigo-200 rounded-md">
        <div className="bg-indigo-200 text-indigo-800 px-4 py-2 font-semibold rounded-t-md">
          🚀 Active Jobs
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-700 border-b">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Active Since</th>
                <th className="py-2 px-4">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-blue-600 cursor-pointer">{job.title}</td>
                  <td className="py-2 px-4">{job.activeSince}</td>
                  <td className="py-2 px-4">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {job.applicants}
                    </span>
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