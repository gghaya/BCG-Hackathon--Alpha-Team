import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import authService from '../services/authService';

export default function JobListingTable() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for adding new job
  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    closing_date: '',
    number_of_positions: 1,
    reference_number: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
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
        closing_date: '',
        number_of_positions: 1,
        reference_number: ''
      });
      setShowJobModal(false);
    } catch (err) {
      console.error('Error creating job:', err);
      alert(err.message);
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

  // Generate post options for dropdown
  const generatePostOptions = () => {
    const options = [];
    for (let i = 1; i <= 20; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };
  
  return (
    <div className="p-4">
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
                <th className="p-3 text-left">Applicants</th>
                <th className="p-3 text-left">Publish Date</th>
                <th className="p-3 text-left">Closing Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {jobListings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">
                    No job listings found. Add your first job listing!
                  </td>
                </tr>
              ) : (
                jobListings.map((job) => (
                  <tr key={job.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600 hover:underline cursor-pointer">
                      {job.job_title}
                    </td>
                    <td className="p-3">{job.reference_number || '-'}</td>
                    <td className="p-3">0</td> {/* This would need a backend count */}
                    <td className="p-3">
                      {job.publish_date ? format(new Date(job.publish_date), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="p-3">
                      {job.closing_date ? format(new Date(job.closing_date), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">✎</button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteJob(job.id)}
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
          <div className="bg-white rounded shadow-lg w-full max-w-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-center">Add Job Listing</h3>
              <p className="text-gray-600 text-sm mt-2 text-center">
                Fill in the job details below and save to add the job listing.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleCreateJob}>
              <div>
                <label className="text-sm font-medium">Job Title</label>
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
                <label className="text-sm font-medium">Job Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                  rows={4}
                  required
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-medium">Reference Number (Optional)</label>
                <input 
                  type="text" 
                  name="reference_number"
                  value={formData.reference_number}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1" 
                />
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
              <div>
                <label className="text-sm font-medium">Number of Positions</label>
                <select 
                  name="number_of_positions"
                  value={formData.number_of_positions}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                >
                  {generatePostOptions()}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
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
}