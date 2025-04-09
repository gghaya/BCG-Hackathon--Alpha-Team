import React, { useState, useEffect } from "react";
import BCGXLogo from './BCGXLogo';

export default function JobApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [briefing, setBriefing] = useState("");

  const steps = [
    { number: 1, title: "Personal Information", description: "Let's start with your basic details" },
    { number: 2, title: "Position Selection", description: "Choose the role you're interested in" },
    { number: 3, title: "Resume Upload", description: "Upload your CV or resume" },
    { number: 4, title: "Final Review", description: "Review your application before submission" }
  ];

  useEffect(() => {
    const fetchJobOffers = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/job_offers");
      const data = await response.json();
      setJobOffers(data);
    };
    fetchJobOffers();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || 
          file.type === "application/msword" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFile(file);
      }
    }
  };

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
    formData.append("job_offer_id", job);
    formData.append("fullName", fullName);
    formData.append("email", email);

    setLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/apply", {
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

  const handleNext = () => {
    if (currentStep === 1 && (!fullName || !email)) {
      alert("Please fill in all required fields.");
      return;
    }
    if (currentStep === 2 && !job) {
      alert("Please select a position.");
      return;
    }
    if (currentStep === 3 && !file) {
      alert("Please upload your resume.");
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1.5">
              Position
            </label>
            <select
              id="job"
              className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              required
            >
              <option value="" className="bg-white">Select a position</option>
              {jobOffers.map((offer) => (
                <option key={offer.id} value={offer.id} className="bg-white">
                  {offer.job_title}
                </option>
              ))}
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1.5">
              Resume
            </label>
            <div 
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-lg transition-all duration-200 ${
                dragActive 
                  ? 'border-indigo-500 border-solid bg-indigo-50' 
                  : 'border-gray-300 border-dashed hover:border-indigo-400 bg-white'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <svg
                  className={`mx-auto h-12 w-12 ${dragActive ? 'text-indigo-500' : 'text-gray-400'}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX up to 10MB
                </p>
                {file && (
                  <p className="text-sm text-indigo-600 mt-2 font-medium">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-200">
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-2">Personal Information</h3>
                <p className="text-gray-700">Name: {fullName}</p>
                <p className="text-gray-700">Email: {email}</p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-2">Selected Position</h3>
                <p className="text-gray-700">
                  {jobOffers.find(o => o.id === job)?.job_title || 'No position selected'}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-2">Resume</h3>
                <p className="text-gray-700">{file?.name || 'No file uploaded'}</p>
              </div>
            </div>

            <div>
              <label htmlFor="briefing" className="block text-sm font-medium text-gray-700 mb-1.5">
                Why are you interested in this position? (Optional)
              </label>
              <textarea
                id="briefing"
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Tell us why you're excited about this role and what you can bring to the team..."
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-bcg-black via-bcg-gray-800 to-bcg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-bcg-mint/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-bcg-mint/10 rounded-full blur-3xl"></div>
        
        {/* Added decorative elements */}
        <div className="absolute left-0 top-0 w-1/3 h-full">
          <div className="absolute top-1/4 left-12 w-48 h-48 bg-bcg-mint/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-24 w-64 h-64 bg-bcg-mint/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-8 w-56 h-56 bg-bcg-mint/5 rounded-full blur-2xl"></div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full">
          <div className="absolute top-1/3 right-16 w-48 h-48 bg-bcg-mint/5 rounded-full blur-2xl"></div>
          <div className="absolute top-2/3 right-24 w-64 h-64 bg-bcg-mint/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-12 w-56 h-56 bg-bcg-mint/5 rounded-full blur-2xl"></div>
        </div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-bcg-mint/20 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-bcg-mint/20 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-bcg-mint/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-bcg-mint/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-bcg-mint/20 rounded-full animate-float-delayed"></div>

        {/* Additional geometric shapes */}
        <div className="absolute left-1/4 top-1/4 w-32 h-32 border border-bcg-mint/20 rounded-full transform rotate-45"></div>
        <div className="absolute right-1/4 bottom-1/4 w-32 h-32 border border-bcg-mint/20 rounded-full transform -rotate-45"></div>
        <div className="absolute left-1/3 bottom-1/3 w-24 h-24 border border-bcg-mint/20 transform rotate-12"></div>
        <div className="absolute right-1/3 top-1/3 w-24 h-24 border border-bcg-mint/20 transform -rotate-12"></div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 backdrop-blur-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8 md:space-x-16">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center ${
                    currentStep >= step.number ? 'text-bcg-mint' : 'text-white/40'
                  }`}
                >
                  <span className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'border-bcg-mint bg-bcg-mint/10' 
                      : 'border-white/20 bg-white/5'
                  }`}>
                    {step.number}
                  </span>
                  <span className="mt-2 text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center py-8">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg animate-fade-in">
            <div className="mb-8">
              <div className="flex justify-center">
                <BCGXLogo className="h-16 w-auto" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-display font-bold text-white">
                {steps[currentStep - 1].title}
              </h2>
              <p className="mt-2 text-center text-base text-white/60">
                {steps[currentStep - 1].description}
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-sm">
                {renderStepContent()}
              </div>

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2.5 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={currentStep === steps.length ? handleSubmit : handleNext}
                  disabled={loading}
                  className={`group relative px-8 py-2.5 bg-bcg-mint text-bcg-black rounded-lg hover:bg-bcg-mint-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bcg-mint transition-all duration-200 overflow-hidden ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-white/20 group-hover:translate-x-full"></span>
                  <span className="relative flex items-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : currentStep === steps.length ? (
                      'Submit Application'
                    ) : (
                      'Continue'
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl w-full max-w-3xl max-h-[80vh] overflow-auto flex flex-col animate-fade-in shadow-xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Application Preview</h2>
              <button
                className="text-white/60 hover:text-bcg-mint transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto">
              {extractedInfo && (
                <>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Personal Information</h3>
                      <div className="bg-white/5 rounded-lg p-4 space-y-2">
                        <p className="text-white"><span className="text-white/60">Name:</span> {extractedInfo.name}</p>
                        <p className="text-white"><span className="text-white/60">Email:</span> {extractedInfo.email}</p>
                        {extractedInfo.phone && (
                          <p className="text-white"><span className="text-white/60">Phone:</span> {extractedInfo.phone}</p>
                        )}
                        {extractedInfo.location && (
                          <p className="text-white"><span className="text-white/60">Location:</span> {extractedInfo.location}</p>
                        )}
                      </div>
                    </div>

                    {extractedInfo.summary && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Summary</h3>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-white/80">{extractedInfo.summary}</p>
                        </div>
                      </div>
                    )}

                    {extractedInfo.experience && extractedInfo.experience.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Experience</h3>
                        <div className="bg-white/5 rounded-lg p-4 space-y-4">
                          {extractedInfo.experience.map((exp, index) => (
                            <div key={index} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                              <p className="text-white font-medium">{exp.title}</p>
                              <p className="text-white/60 text-sm">{exp.company}</p>
                              <p className="text-white/60 text-sm">{exp.date}</p>
                              <p className="text-white/80 mt-2">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {extractedInfo.education && extractedInfo.education.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Education</h3>
                        <div className="bg-white/5 rounded-lg p-4 space-y-4">
                          {extractedInfo.education.map((edu, index) => (
                            <div key={index} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                              <p className="text-white font-medium">{edu.degree}</p>
                              <p className="text-white/60 text-sm">{edu.school}</p>
                              <p className="text-white/60 text-sm">{edu.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {extractedInfo.skills && extractedInfo.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Skills</h3>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {extractedInfo.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-bcg-mint/10 text-bcg-mint rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
