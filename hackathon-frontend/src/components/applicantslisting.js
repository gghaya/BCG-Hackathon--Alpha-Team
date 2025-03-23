import React from "react";
import { FaDownload, FaStar } from "react-icons/fa";

const applicants = [
  {
    id: 1,
    firstName: "Ghaya",
    lastName: "Gghaya",
    email: "ghzlnghaya@gmail.com",
    jobTitle: "Software Engineer",
    status: "Applied",
    rating: 3,
    missingSkills: ["Docker", "Redux"],
    skillScore: "82%",
    cvLink: "/cv/ghaya_cv.pdf",
  },
  // Add more applicants if needed
];

const ApplicantListing = () => {
  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* Page Title */}
      <h2 className="text-2xl font-light mb-4">cargo</h2>

      {/* Table Container */}
      <div className="bg-white rounded-md shadow border border-gray-200">
        {/* Header Row */}
        <div className="flex justify-between items-center bg-indigo-100 px-4 py-3 rounded-t-md">
          <span className="font-semibold text-gray-700">Applicant Listing</span>
          <div className="flex items-center gap-2">
            <button className="bg-white text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">
              Filter
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
              + Add Applicant
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-t border-gray-200 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Application</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Missing Skills</th>
              <th className="px-4 py-2">Skill Score</th>
              <th className="px-4 py-2">CV</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr
                key={applicant.id}
                className="border-t text-sm hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{`${applicant.firstName} ${applicant.lastName}`}</td>
                <td className="px-4 py-3">{applicant.email}</td>
                <td className="px-4 py-3 space-x-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {applicant.status}
                  </span>
                  <span className="text-blue-600 underline cursor-pointer">
                    {applicant.jobTitle}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`inline-block mr-1 ${
                        i < applicant.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </td>
                <td className="px-4 py-3">
                  {applicant.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs mr-1"
                    >
                      {skill}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    {applicant.skillScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={applicant.cvLink}
                    download
                    className="text-blue-600 hover:text-blue-800"
                    title="Download CV"
                  >
                    <FaDownload />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantListing;
