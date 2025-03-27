import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import authService from '../services/authService';
import { FaSearch } from 'react-icons/fa';

export default function JobListingTable() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [filter, setFilter] = useState({
    search:"",
  });
  // Form state for adding new job
  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    requirements: '',
    responsibilities: [],
    skills: [],
    education: '',
    skills_priority: 'medium',
    requirements_priority: 'medium',
    education_priority: 'medium',
    closing_date: '',
    number_of_positions: 1,
    reference_number: ''
  });

  // State for skill input
  const [newSkill, setNewSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');

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

  // Fetch job listings
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
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
    };
    
    fetchJobs();
  }, []);

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
        description: '',
        requirements: '',
        responsibilities: [],
        skills: [],
        education: '',
        skills_priority: 'medium',
        requirements_priority: 'medium',
        education_priority: 'medium',
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
      description: job.description,
      requirements: job.requirements || '',
      responsibilities: job.responsibilities || [],
      skills: job.skills || [],
      education: job.education || '',
      skills_priority: job.skills_priority || 'medium',
      requirements_priority: job.requirements_priority || 'medium',
      education_priority: job.education_priority || 'medium',
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
        description: '',
        requirements: '',
        responsibilities: [],
        skills: [],
        education: '',
        skills_priority: 'medium',
        requirements_priority: 'medium',
        education_priority: 'medium',
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
  const filteredJobs = jobListings.filter((job) => {
    const search = filter.search.toLowerCase();
    return (
      job.job_title?.toLowerCase().includes(search) ||
      job.reference_number?.toLowerCase().includes(search) ||
      job.skills?.some(skill =>
        skill.toLowerCase().includes(search)
      )
    );
  });
  return (
    <div className="p-4">
      <nav className="bg-white shadow-sm fixed top-0 left-[20%] right-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1">
            <form  className="relative">
              <input
                type="text"
                value={filter.search}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }              
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
        <h2 className="text-lg font-semibold">Job Listings</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowJobModal(true)} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
            + Add Job Listing
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading job listings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          Error: {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Job Title</th>
                <th className="p-3 text-left">Reference #</th>
                <th className="p-3 text-left">Skills</th>
                <th className="p-3 text-left">Publish Date</th>
                <th className="p-3 text-left">Closing Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">
                    No job listings found. Add your first job listing!
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600 hover:underline cursor-pointer">
                      {job.job_title}
                    </td>
                    <td className="p-3">{job.reference_number || '-'}</td>
                    <td className="p-3">
                      {job.skills ? (
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(job.skills) && job.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                          {Array.isArray(job.skills) && job.skills.length > 3 && (
                            <span className="text-gray-500 text-xs">+{job.skills.length - 3} more</span>
                          )}
                        </div>
                      ) : "-"}
                    </td>
                    <td className="p-3">
                      {job.publish_date ? format(new Date(job.publish_date), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="p-3">
                      {job.closing_date ? format(new Date(job.closing_date), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button 
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleScoreAllCandidates(job.id)}
                        title="Score all candidates"
                      >
                        📊
                      </button>
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditJob(job)}
                        title="Edit job"
                      >
                        ✎
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete job"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Job Add Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-center">Add Job Listing</h3>
              <p className="text-gray-600 text-sm mt-2 text-center">
                Fill in the job details below and save to add the job listing.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleCreateJob}>
              {/* Basic Job Information */}
              <div>
                <label className="text-sm font-medium">Job Title*</label>
                <input 
                  type="text" 
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Job Description*</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                  rows={4}
                  required
                ></textarea>
              </div>
              
              {/* Requirements */}
              <div>
                <label className="text-sm font-medium">Requirements</label>
                <textarea 
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                  rows={3}
                  placeholder="List job requirements here..."
                ></textarea>
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Priority:</span>
                  <select 
                    name="requirements_priority"
                    value={formData.requirements_priority}
                    onChange={handleInputChange}
                    className="text-sm border-gray-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              {/* Responsibilities */}
              <div>
                <label className="text-sm font-medium">Responsibilities</label>
                <div className="flex mt-1 mb-2">
                  <input 
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    className="w-full rounded-l-md border p-2"
                    placeholder="Add a responsibility"
                  />
                  <button 
                    type="button"
                    onClick={handleAddResponsibility}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                  >
                    Add
                  </button>
                </div>
                
                {formData.responsibilities.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-5 list-disc">
                    {formData.responsibilities.map((resp, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{resp}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveResponsibility(index)}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Skills */}
              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="flex mt-1 mb-2">
                  <input 
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full rounded-l-md border p-2"
                    placeholder="Add a skill"
                  />
                  <button 
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                  >
                    Add
                  </button>
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center"
                      >
                        {skill}
                        <button 
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-1 text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Priority:</span>
                  <select 
                    name="skills_priority"
                    value={formData.skills_priority}
                    onChange={handleInputChange}
                    className="text-sm border-gray-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              {/* Education */}
              <div>
                <label className="text-sm font-medium">Education Requirements</label>
                <input 
                  type="text" 
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                  placeholder="e.g., Bachelor's degree in Computer Science"
                />
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Priority:</span>
                  <select 
                    name="education_priority"
                    value={formData.education_priority}
                    onChange={handleInputChange}
                    className="text-sm border-gray-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              {/* Additional Job Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Reference Number</label>
                  <input 
                    type="text" 
                    name="reference_number"
                    value={formData.reference_number}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded mt-1" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Number of Positions</label>
                  <input 
                    type="number" 
                    name="number_of_positions"
                    value={formData.number_of_positions}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border p-2 rounded mt-1" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Closing Date</label>
                <input 
                  type="date" 
                  name="closing_date"
                  value={formData.closing_date}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Edit Modal */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-center">Edit Job Listing</h3>
              <p className="text-gray-600 text-sm mt-2 text-center">
                Update the job details below.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleUpdateJob}>
              {/* Basic Job Information */}
              <div>
                <label className="text-sm font-medium">Job Title*</label>
                <input 
                  type="text" 
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Job Description*</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                  rows={4}
                  required
                ></textarea>
              </div>
              
              {/* Requirements */}
              <div>
                <label className="text-sm font-medium">Requirements</label>
                <textarea 
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                  rows={3}
                  placeholder="List job requirements here..."
                ></textarea>
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Priority:</span>
                  <select 
                    name="requirements_priority"
                    value={formData.requirements_priority}
                    onChange={handleInputChange}
                    className="text-sm border-gray-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              {/* Responsibilities */}
              <div>
                <label className="text-sm font-medium">Responsibilities</label>
                <div className="flex mt-1 mb-2">
                  <input 
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    className="w-full rounded-l-md border p-2"
                    placeholder="Add a responsibility"
                  />
                  <button 
                    type="button"
                    onClick={handleAddResponsibility}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                  >
                    Add
                  </button>
                </div>
                
                {formData.responsibilities.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-5 list-disc">
                    {formData.responsibilities.map((resp, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{resp}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveResponsibility(index)}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Skills */}
              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="flex mt-1 mb-2">
                  <input 
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full rounded-l-md border p-2"
                    placeholder="Add a skill"
                  />
                  <button 
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                  >
                    Add
                  </button>
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center"
                      >
                        {skill}
                        <button 
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-1 text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Priority:</span>
                  <select 
                    name="skills_priority"
                    value={formData.skills_priority}
                    onChange={handleInputChange}
                    className="text-sm border-gray-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              {/* Education */}
              <div>
                <label className="text-sm font-medium">Education Requirements</label>
                <input 
                  type="text" 
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                  placeholder="e.g., Bachelor's degree in Computer Science"
                />
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Priority:</span>
                  <select 
                    name="education_priority"
                    value={formData.education_priority}
                    onChange={handleInputChange}
                    className="text-sm border-gray-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              {/* Additional Job Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Reference Number</label>
                  <input 
                    type="text" 
                    name="reference_number"
                    value={formData.reference_number}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded mt-1" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Number of Positions</label>
                  <input 
                    type="number" 
                    name="number_of_positions"
                    value={formData.number_of_positions}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border p-2 rounded mt-1" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Closing Date</label>
                <input 
                  type="date" 
                  name="closing_date"
                  value={formData.closing_date}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>
  );
}