import React, { useState, useEffect } from "react";
import { FaDownload, FaStar, FaFilter } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from 'axios';

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
  // Add more test data
  ...Array(20).fill(null).map((_, index) => ({
    id: index + 2,
    firstName: `Test${index + 2}`,
    lastName: "User",
    email: `test${index + 2}@example.com`,
    jobTitle: "Software Engineer",
    status: "Applied",
    rating: Math.floor(Math.random() * 5) + 1,
    missingSkills: ["Docker", "Redux"],
    skillScore: `${Math.floor(Math.random() * 30) + 70}%`,
    cvLink: "/cv/test_cv.pdf",
  })),
];

const ApplicantListing = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [jobtitle, setjobtitle] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:5000/api/candidates') // Adjust base URL if needed
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/job_titles') // Adjust base URL if needed
      .then(response => {
        setjobtitle(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  }, []);



  // const status = Applied
  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] p-6">
      {/* Fixed Header Section */}
      <div className="mb-4">
        {/* <h2 className="text-2xl font-light">cargo</h2> */}
      </div>

      {/* Table Container with fixed height and scroll */}
      <div className="flex-1 bg-white rounded-md shadow border border-gray-200 flex flex-col  overflow-hidden">
        {/* Fixed Table Header */}
        <div className="flex justify-between items-center bg-indigo-100 px-4 py-3 rounded-t-md">
          <span className="font-semibold text-gray-700">Applicant Listing</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 ${
                showFilter 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-600"
              } px-3 py-1 border border-gray-300 rounded hover:bg-blue-600 hover:text-white transition-colors text-sm`}
            >
              <FaFilter className="text-xs" />
              Filter
            </button>
            <button onClick={() => setShowModal(true)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
              + Add Applicant
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div className="bg-gray-50 border-b border-gray-200 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Filter Options</h3>
              <button 
                onClick={() => setShowFilter(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Matching Score</label>
                <select className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm">
                <option value="">All Scores</option>
                <option value="90">90% and above</option>
                  <option value="80">80% and above</option>
                  <option value="70">70% and above</option>
                  <option value="60">60% and above</option>
                  <option value="50">50% and above</option>
                  <option value="40">40% and above</option>
                  <option value="30">30% and above</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <select className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm">
                {jobtitle.map((job) => (
                  <option value="">{job.job_title+"-MB-"+job.id}</option>
                ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Skill Score</label>
                <select className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm">
                  <option value="">All Scores</option>
                  <option value="90">90% and above</option>
                  <option value="80">80% and above</option>
                  <option value="70">70% and above</option>
                  <option value="60">70% and above</option>
                  <option value="50">70% and above</option>
                  <option value="40">70% and above</option>
                  <option value="30">70% and above</option>

                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                Clear All
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-t border-gray-200 text-sm text-gray-600 sticky top-0">
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
              {candidates.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="border-t text-sm hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{`${applicant.full_name}`}</td>
                  <td className="px-4 py-3">{applicant.email}</td>
                  <td className="px-4 py-3 space-x-2">
                    {/* <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {status}
                    </span> */}
                    <span className="text-blue-600 underline cursor-pointer">
                      {applicant.job_title +"-MB-"+ applicant.job_offer_id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`inline-block mr-1 ${
                          i < (applicant.skills_score*4.5)/100
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    {applicant.missing_skills.map((skill, idx) => (
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
                      {applicant.skills_score +"/"+ 100}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={applicant.resume_path}
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

       {/* Modal Popup for Adding Applicant */}
       {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-center">Applicant Quick Add</h3>
              <p className="text-gray-600 text-sm mt-2 text-center">
                This is the applicant 'quick add' screen. Simply key in the essential details and save.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name(s)</label>
                  <input type="text" className="w-full border p-2 rounded mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full border p-2 rounded mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input type="email" className="w-full border p-2 rounded mt-1 bg-gray-100" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Optional Fields</label>
                <label className="text-sm font-medium mt-1 block">Job Applying For</label>
                <select className="w-full border p-2 rounded mt-1">
                  <option value="">Select a job</option>
                  <option value="software-engineer">Software Engineer</option>
                  {/* More options dynamically */}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Upload CV</label>
                <input type="file" accept="application/pdf" className="w-full border p-2 rounded mt-1" />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        )}
    </div>
    
  );
};

export default ApplicantListing;
