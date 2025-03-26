import React, { useState, useEffect } from "react";

export default function JobApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchJobOffers = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/job_offers");
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
  
    if (!job || job === "Select a job offer") {
      alert("Please select a job offer.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_offer_id", job);  // ✅ Include job_offer_id in the form data
    formData.append("fullName", fullName);  // ✅ Include job_offer_id in the form data
    formData.append("email", email);  // ✅ Include job_offer_id in the form data

  
    setLoading(true);
  
    try {
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await fetch("http://127.0.0.1:5000/apply", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.error) {
        alert(`Error: ${data.error}`);
        setLoading(false);
        return;
      }
  
      setExtractedInfo({
        name: data.name,
        email: data.contact?.email,
        phone: data.contact?.phone,
        linkedin: data.contact?.linkedin,
        location: data.contact?.location,
        summary: data.summary,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
      });
      setShowModal(true);
    } catch (error) {
      alert("Failed to upload resume.");
    } finally {
      setLoading(false);
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
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Apply
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="border-t-4 border-blue-500 border-solid w-12 h-12 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-3/4 max-h-screen flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Extracted Resume Info</h2>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto">
              <pre>{JSON.stringify(extractedInfo, null, 2)}</pre>
            </div>

            {/* Close Button */}
            <button
              className="mt-4 bg-red-500 text-white p-2 rounded-lg self-center"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
