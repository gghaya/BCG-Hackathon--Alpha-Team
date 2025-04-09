import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import authService from '../services/authService';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaFilter, FaBriefcase, FaMapMarkerAlt, FaBuilding, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';

export default function JobListingTable() {
  const location = useLocation();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [filter, setFilter] = useState({
    search:"",
    status: '',
  });
  // Form state for adding new job
  const [formData, setFormData] = useState({
    job_title: '',
    department: '',
    location: '',
    job_type: '',
    description: '',
    requirements: '',
    closing_date: '',
    number_of_positions: 1,
    reference_number: ''
  });

  // State for skill input
  const [newSkill, setNewSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');

  // Check if we're in demo mode
  useEffect(() => {
    setIsDemoMode(location.pathname.startsWith('/demo'));
  }, [location]);

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        if (isDemoMode) {
          // Use mock data for demo mode
          setTimeout(() => {
            setJobListings([
              {
                id: 1,
                job_title: 'Senior Developer',
                department: 'Engineering',
                location: 'New York, NY',
                job_type: 'Full-time',
                description: 'We are looking for a senior developer to join our team...',
                requirements: '5+ years of experience with React, Node.js, and TypeScript...',
                closing_date: '2023-12-31',
                status: 'open'
              },
              {
                id: 2,
                job_title: 'UX Designer',
                department: 'Design',
                location: 'San Francisco, CA',
                job_type: 'Full-time',
                description: 'Join our design team to create beautiful and intuitive user experiences...',
                requirements: '3+ years of experience with Figma, Adobe XD, and user research...',
                closing_date: '2023-12-15',
                status: 'open'
              },
              {
                id: 3,
                job_title: 'Product Manager',
                department: 'Product',
                location: 'Remote',
                job_type: 'Full-time',
                description: 'Lead product development initiatives from conception to launch...',
                requirements: '4+ years of product management experience, strong analytical skills...',
                closing_date: '2023-11-30',
                status: 'closed'
              },
              {
                id: 4,
                job_title: 'Data Scientist',
                department: 'Analytics',
                location: 'Boston, MA',
                job_type: 'Full-time',
                description: 'Work with large datasets to extract insights and build predictive models...',
                requirements: 'PhD in Computer Science, Statistics, or related field, Python, R, SQL...',
                closing_date: '2023-12-20',
                status: 'open'
              },
              {
                id: 5,
                job_title: 'Frontend Developer',
                department: 'Engineering',
                location: 'Chicago, IL',
                job_type: 'Full-time',
                description: 'Create responsive and interactive user interfaces for our web applications...',
                requirements: '3+ years of experience with React, JavaScript, HTML, CSS...',
                closing_date: '2023-12-10',
                status: 'open'
              },
              {
                id: 6,
                job_title: 'Full Stack Developer',
                department: 'Engineering',
                location: 'Austin, TX',
                job_type: 'Full-time',
                description: 'Develop both frontend and backend components of our applications...',
                requirements: '4+ years of experience with React, Node.js, MongoDB, AWS...',
                closing_date: '2023-11-15',
                status: 'closed'
              },
              {
                id: 7,
                job_title: 'DevOps Engineer',
                department: 'Operations',
                location: 'Seattle, WA',
                job_type: 'Full-time',
                description: 'Build and maintain our CI/CD pipelines and cloud infrastructure...',
                requirements: '3+ years of experience with Docker, Kubernetes, AWS, Terraform...',
                closing_date: '2023-12-25',
                status: 'open'
              },
              {
                id: 8,
                job_title: 'UI Designer',
                department: 'Design',
                location: 'Los Angeles, CA',
                job_type: 'Full-time',
                description: 'Create visually stunning interfaces for our digital products...',
                requirements: '3+ years of experience with Figma, Adobe Creative Suite, UI design...',
                closing_date: '2023-12-05',
                status: 'open'
              },
              {
                id: 9,
                job_title: 'Backend Developer',
                department: 'Engineering',
                location: 'Denver, CO',
                job_type: 'Full-time',
                description: 'Design and implement scalable backend services and APIs...',
                requirements: '4+ years of experience with Node.js, Python, PostgreSQL, Redis...',
                closing_date: '2023-11-20',
                status: 'closed'
              },
              {
                id: 10,
                job_title: 'QA Engineer',
                department: 'Quality Assurance',
                location: 'Portland, OR',
                job_type: 'Full-time',
                description: 'Ensure the quality of our products through comprehensive testing...',
                requirements: '3+ years of experience with automated testing, Selenium, Jest...',
                closing_date: '2023-12-18',
                status: 'open'
              }
            ]);
            setLoading(false);
          }, 1000); // Simulate loading delay
        } else {
          // In a real app, we would fetch data from the API
          try {
            const response = await fetch('http://localhost:5000/api/job_offers', {
              headers: {
                ...authService.authHeader()
              }
            });
            
            if (!response.ok) {
              throw new Error('Failed to fetch job listings');
            }
            
            const data = await response.json();
            setJobListings(data);
          } catch (err) {
            setError(err.message);
            console.error('Error fetching jobs:', err);
          } finally {
            setLoading(false);
          }
        }
      } catch (err) {
        setError("Error loading jobs: " + err.message);
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [isDemoMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  // Handle adding a new responsibility
  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, newResponsibility.trim()]
      });
      setNewResponsibility('');
    }
  };

  // Handle removing a responsibility
  const handleRemoveResponsibility = (index) => {
    const updatedResponsibilities = [...formData.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setFormData({
      ...formData,
      responsibilities: updatedResponsibilities
    });
  };

  // Handle job creation
  const handleCreateJob = async (e) => {
    e.preventDefault();
    
    try {
      setModalLoading(true);
      const response = await fetch('http://localhost:5000/api/job_offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.authHeader()
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create job listing');
      }
      
      const newJob = await response.json();
      
      // Add new job to the list
      setJobListings([...jobListings, newJob]);
      
      // Reset form and close modal
      setFormData({
        job_title: '',
        department: '',
        location: '',
        job_type: '',
        description: '',
        requirements: '',
        closing_date: '',
        number_of_positions: 1,
        reference_number: ''
      });
      setShowJobModal(false);
    } catch (err) {
      console.error('Error creating job:', err);
      alert(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle editing a job
  const handleEditJob = (job) => {
    setEditingJob(job);
    setFormData({
      job_title: job.job_title,
      department: job.department,
      location: job.location,
      job_type: job.job_type,
      description: job.description,
      requirements: job.requirements || '',
      closing_date: job.closing_date || '',
      number_of_positions: job.number_of_positions || 1,
      reference_number: job.reference_number || ''
    });
    setShowEditModal(true);
  };

  // Handle updating a job
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    
    try {
      setModalLoading(true);
      const response = await fetch(`http://localhost:5000/api/job_offers/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.authHeader()
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update job listing');
      }
      
      const updatedJob = await response.json();
      
      // Update job in the list
      setJobListings(jobListings.map(job => 
        job.id === updatedJob.id ? updatedJob : job
      ));
      
      // Reset form and close modal
      setEditingJob(null);
      setShowEditModal(false);
      
      // Reset form
      setFormData({
        job_title: '',
        department: '',
        location: '',
        job_type: '',
        description: '',
        requirements: '',
        closing_date: '',
        number_of_positions: 1,
        reference_number: ''
      });
    } catch (err) {
      console.error('Error updating job:', err);
      alert(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/job_offers/${jobId}`, {
        method: 'DELETE',
        headers: {
          ...authService.authHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job listing');
      }
      
      // Remove job from the list
      setJobListings(jobListings.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      alert(err.message);
    }
  };

  // Handle scoring all candidates for a job
  const handleScoreAllCandidates = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/score_all_candidates/${jobId}`, {
        method: 'POST',
        headers: {
          ...authService.authHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to score candidates');
      }
      
      const result = await response.json();
      alert(`Successfully scored ${result.candidates_scored} candidates for this job.`);
    } catch (err) {
      console.error('Error scoring candidates:', err);
      alert(err.message);
    }
  };

  // Generate post options for dropdown
  const generatePostOptions = () => {
    const options = [];
    for (let i = 1; i <= 20; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const applyFilter = () => {
    return jobListings.filter((job) => {
      const matchesStatus = filter.status === '' || job.status === filter.status;
      const matchesSearch = filter.search === '' || 
        job.job_title.toLowerCase().includes(filter.search.toLowerCase()) ||
        job.department.toLowerCase().includes(filter.search.toLowerCase()) ||
        job.location.toLowerCase().includes(filter.search.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  };

  const filteredJobs = applyFilter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job Listings</h1>
        <button
          onClick={() => setShowJobModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add New Job
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filter.search}
                onChange={handleFilterChange}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
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
          <div className="mt-4 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Filter Options</h3>
              <button 
                onClick={() => setShowFilter(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-blue-500" />
                    Job Title
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaBuilding className="mr-2 text-gray-500" />
                    Department
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    Location
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-gray-500" />
                    Type
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-gray-500" />
                    Closing Date
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-gray-500" />
                    Status
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.job_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      {job.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      {job.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      {job.job_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      {job.closing_date ? new Date(job.closing_date).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status === 'open' ? (
                        <span className="flex items-center">
                          <FaCheckCircle className="mr-1" /> Open
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FaTimesCircle className="mr-1" /> Closed
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaSearch className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="text-lg">No jobs found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h2>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <form onSubmit={editingJob ? handleUpdateJob : handleCreateJob}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Job Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closing Date
                    </label>
                    <input
                      type="date"
                      name="closing_date"
                      value={formData.closing_date}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}