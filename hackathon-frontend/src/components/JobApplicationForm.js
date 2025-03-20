import React, { useState, useEffect } from "react";

export default function JobApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJobOffers = async () => {
      const response = await fetch("http://127.0.0.1:5000/job_offers");
      const data = await response.json();
      setJobOffers(data);
    };
    fetchJobOffers();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/apply", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      setExtractedInfo({
        name: data.name,
        email: data.email,
        job: data.job,
        experience: data.experience,
        experienceSection: data.experience_section,
      });
      setShowModal(true);
    } catch (error) {
      alert("Failed to upload resume.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        >
          <option>Select a job offer</option>
          {jobOffers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.job_title}
            </option>
          ))}
        </select>
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded-lg"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
        >
          Apply Now
        </button>
      </form>

      {showModal && extractedInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Extracted Resume Information</h2>
            <div className="space-y-4">
              <p><strong>Name:</strong> {extractedInfo.name || "Not found"}</p>
              <p><strong>Email:</strong> {extractedInfo.email || "Not found"}</p>
              <p><strong>Job Title:</strong> {extractedInfo.job || "Not found"}</p>
              <div>
                <strong>Experience Section:</strong>
                <div className="whitespace-pre-line break-words mt-2">{extractedInfo.experienceSection || "Not found"}</div>
              </div>
              <div>
                <strong>Experience:</strong>
                <div className="whitespace-pre-line break-words mt-2">{extractedInfo.experience || "Not found"}</div>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
