// import React from "react";
import React, { useState } from "react";
export default function JobListingTable() {
      const [showApplicantModal, setShowApplicantModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);

    const generatePostOptions = () => {
      const options = [];
      for (let i = 1; i <= 1000; i++) {
        options.push(<option key={i} value={i}>{i}</option>);
      }
      return options;
    };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Job Listings</h2>
        <div className="flex gap-2">
          {/* <button className="border px-3 py-1 rounded hover:bg-gray-100">🔍 Filter</button> */}
          <button onClick={() => setShowJobModal(true)} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
            + Add Job Listing
          </button>
        </div>
      </div>

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
            <tr className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium text-blue-600 hover:underline cursor-pointer">Software Engineer</td>
              <td className="p-3">SE-2025-01</td>
              <td className="p-3">1</td>
              <td className="p-3">2025-03-20</td>
              <td className="p-3">2025-04-15</td>
              <td className="p-3 text-center space-x-2">
                <button className="text-blue-500 hover:text-blue-700">✎</button>
                <button className="text-red-500 hover:text-red-700">🗑</button>
              </td>
            </tr>
            {/* Repeat rows dynamically */}
          </tbody>
        </table>
      </div>

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

            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Job Name</label>
                <input type="text" className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <textarea className="w-full border p-2 rounded mt-1" rows={4}></textarea>
              </div>
              <div>
                <label className="text-sm font-medium">Closing Date</label>
                <input type="date" className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Number of Positions</label>
                <select className="w-full border p-2 rounded mt-1">
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

      {/* Applicant Modal (previous one remains unchanged) */}
      {showApplicantModal && (
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
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Upload CV</label>
                <input type="file" accept="application/pdf" className="w-full border p-2 rounded mt-1" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowApplicantModal(false)}
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
