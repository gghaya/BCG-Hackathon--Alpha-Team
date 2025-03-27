import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import ApplicantCard from "./ApplicantCard";
import authService from "../services/authService";
import { FaSearch } from 'react-icons/fa';

const ApplicantListing = () => {

  const [searchQuery, setSearchQuery] = useState('');

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   // Implement search functionality here
  //   console.log('Searching for:', searchQuery);
  // };


  const [applicants, setApplicants] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    jobId: "",
    minScore: "",
    status: "",
    search:"",
  });


  const [minScore, setMinScore] = useState(60);
  const [selectedJob, setSelectedJob] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/applicants", {
        headers: {
          ...authService.authHeader()
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }

      const data = await response.json();
      setApplicants(data);
      setError(null);
    } catch (err) {
      setError("Error loading applicants: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const applyFilter = () => {
    // Filter based on selected criteria
    return applicants.filter(applicant => {
      // Filter by job ID if selected
      if (filter.jobId && applicant.jobTitle.trim() !== filter.jobId.trim()) {
        console.log("|",filter.jobId,"|", applicant.jobTitle,"|" )
        return false;
      }
      
      // Filter by minimum score if set
      if (filter.minScore) {
        const score = parseFloat(applicant.scores?.overall || '0');
        if (score < parseInt(filter.minScore)) {
          return false;
        }
      }
      
      if (filter.search)
        {
          if (applicant.fullName.includes(filter.search) == false)
          {
            if (applicant.email.includes(filter.search) == false)
            {
              if (applicant.jobTitle.includes(filter.search) == false)
                return false;
            }
          }   
            // return false;
        }
      return true;
    });
  };

  const handleScoreCandidate = async (candidateId) => {
    try {
      // Get the job ID from the candidate
      const candidate = applicants.find(a => a.id === candidateId);
      if (!candidate || !candidate.jobId) {
        alert("Cannot score candidate without a job ID");
        return;
      }

      const response = await fetch("http://localhost:5000/api/score_candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authService.authHeader()
        },
        body: JSON.stringify({
          candidate_id: candidateId,
          job_id: candidate.jobId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to score candidate");
      }

      // Refresh applicants list to get updated scores
      fetchApplicants();
    } catch (err) {
      setError("Error scoring candidate: " + err.message);
      console.error(err);
    }
  };

  const filteredApplicants = applyFilter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
      
    <div className="h-full flex flex-col bg-[#F8FAFC] p-6">
      <nav className="bg-white shadow-sm fixed top-0 left-[20%] right-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1">
            <form  className="relative">
              <input
                type="text"
                name="search"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                value={filter.search} 
                onChange={handleFilterChange} 
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>
          </div>
        </div>
      </div>
    </nav>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Applicants ({filteredApplicants.length})</h2>
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
        </div>
      </div>

      {/* Filter Section */}
      {showFilter && (
        <div className="bg-white rounded-md shadow border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
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
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input 
                type="text" 
                name="jobId" 
                value={filter.jobId} 
                onChange={handleFilterChange} 
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm"
                placeholder="Enter job Title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Minimum Score</label>
              <select 
                name="minScore" 
                value={filter.minScore} 
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm"
              >
                <option value="">All Scores</option>
                <option value="90">90% and above</option>
                <option value="80">80% and above</option>
                <option value="70">70% and above</option>
                <option value="60">60% and above</option>
                <option value="50">50% and above</option>
                <option value="40">40% and above</option>
                <option value="30">30% and above</option>
                <option value="20">20% and above</option>
                <option value="10">10% and above</option>

              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button 
              onClick={() => setFilter({ jobId: "", minScore: "", status: "" })}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Applicants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApplicants.map((applicant) => (
          <ApplicantCard 
            key={applicant.id} 
            applicant={applicant}
            onScoreClick={handleScoreCandidate}
          />
        ))}
        
        {filteredApplicants.length === 0 && (
          <div className="col-span-3 text-center p-8 bg-white rounded-md shadow">
            <p className="text-gray-500">No applicants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantListing;