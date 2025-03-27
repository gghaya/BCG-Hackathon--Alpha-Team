import React from 'react';
import { FaDownload, FaStar, FaArrowUp } from 'react-icons/fa';

const ApplicantCard = ({ applicant, onScoreClick }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-blue-100 text-blue-700';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Convert score to number for color calculation
  const overallScore = parseFloat(applicant.scores?.overall || '0');
  const scoreColorClass = getScoreColor(overallScore);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{applicant.fullName}</h3>
          <p className="text-gray-600 text-sm">{applicant.email}</p>
          <div className="mt-1">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {applicant.jobTitle || 'No job title'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={`text-xl font-bold px-3 py-1 rounded-full ${scoreColorClass}`}>
            {applicant.scores?.overall || '0'}%
          </div>
          <button 
            onClick={() => onScoreClick(applicant.id)} 
            className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center"
          >
            <FaArrowUp className="mr-1" size={10} />
            Rescore
          </button>
        </div>
      </div>
      
      {/* Detailed Scores */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-gray-50 rounded p-2">
          <div className="font-medium">Skills</div>
          <div className="text-lg">{applicant.scores?.skills || 0}%</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="font-medium">Requirements</div>
          <div className="text-lg">{applicant.scores?.requirements || 0}%</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="font-medium">Education</div>
          <div className="text-lg">{applicant.scores?.education || 0}%</div>
        </div>
      </div>
      
      {/* Skills Gap Analysis */}
      <div className="mt-4">
        <div className="text-sm font-medium mb-1">Skills Gap Analysis</div>
        <div className="flex flex-wrap gap-1">
          {applicant.missingSkills && applicant.missingSkills.map((skill, idx) => (
            <span key={idx} className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))}
          
          {(!applicant.missingSkills || applicant.missingSkills.length === 0) && (
            <span className="text-xs text-gray-500">No missing skills</span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-4 flex justify-end">
        <a
          href={applicant.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center"
          title="View Resume"
        >
          <FaDownload className="mr-1" /> Resume
        </a>
      </div>
    </div>
  );
};

export default ApplicantCard;