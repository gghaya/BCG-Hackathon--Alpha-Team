// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../services/authService';

// const JobCreationForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     job_title: '',
//     description: '',
//     closing_date: '',
//     number_of_positions: 1,
//     reference_number: '',
//     requirements: '',
//     education: '',
//     skills: [],
//     skills_priority: 'medium',
//     requirements_priority: 'medium',
//     education_priority: 'medium'
//   });
  
//   const [newSkill, setNewSkill] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };
  
//   const handleSkillAdd = () => {
//     if (newSkill.trim() !== '') {
//       setFormData({
//         ...formData,
//         skills: [...formData.skills, newSkill.trim()]
//       });
//       setNewSkill('');
//     }
//   };
  
//   const handleSkillRemove = (index) => {
//     setFormData({
//       ...formData,
//       skills: formData.skills.filter((_, i) => i !== index)
//     });
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await fetch('http://localhost:5000/api/job_offers', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...authService.authHeader()
//         },
//         body: JSON.stringify(formData)
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to create job listing');
//       }
      
//       const data = await response.json();
//       navigate('/jobs');
//     } catch (error) {
//       console.error('Error creating job:', error);
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white/10 backdrop-blur-lg shadow-card rounded-2xl p-8 animate-fade-in">
//         <div className="mb-8">
//           <h2 className="text-2xl font-display font-bold text-white">Create New Job Listing</h2>
//           <p className="mt-2 text-bcg-gray-300">Fill in the details below to create a new job posting.</p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             <div>
//               <label className="block text-sm font-medium text-bcg-gray-300">Job Title*</label>
//               <input 
//                 type="text" 
//                 name="job_title"
//                 value={formData.job_title}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//                 required
//                 placeholder="Enter job title"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-bcg-gray-300">Reference Number</label>
//               <input 
//                 type="text" 
//                 name="reference_number"
//                 value={formData.reference_number}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//                 placeholder="Enter reference number"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-bcg-gray-300">Description*</label>
//             <textarea 
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="4"
//               className="mt-1 block w-full rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               required
//               placeholder="Enter detailed job description"
//             ></textarea>
//           </div>
          
//           {/* Requirements */}
//           <div>
//             <label className="block text-sm font-medium text-bcg-gray-300">Requirements</label>
//             <textarea 
//               name="requirements"
//               value={formData.requirements}
//               onChange={handleChange}
//               rows="3"
//               className="mt-1 block w-full rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               placeholder="Enter job requirements"
//             ></textarea>
//             <div className="mt-2 flex items-center">
//               <span className="text-sm text-bcg-gray-300 mr-2">Priority:</span>
//               <select 
//                 name="requirements_priority"
//                 value={formData.requirements_priority}
//                 onChange={handleChange}
//                 className="text-sm rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white shadow-sm p-2 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="critical">Critical</option>
//               </select>
//             </div>
//           </div>
          
//           {/* Skills */}
//           <div>
//             <label className="block text-sm font-medium text-bcg-gray-300">Skills</label>
//             <div className="flex mt-1">
//               <input 
//                 type="text"
//                 value={newSkill}
//                 onChange={(e) => setNewSkill(e.target.value)}
//                 className="block w-full rounded-l-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//                 placeholder="Add required skills"
//               />
//               <button 
//                 type="button"
//                 onClick={handleSkillAdd}
//                 className="bg-bcg-mint text-bcg-black px-6 rounded-r-xl hover:bg-bcg-mint-light transition-colors duration-200 font-medium"
//               >
//                 Add
//               </button>
//             </div>
            
//             {formData.skills.length > 0 && (
//               <div className="mt-3 flex flex-wrap gap-2">
//                 {formData.skills.map((skill, index) => (
//                   <span 
//                     key={index}
//                     className="bg-bcg-gray-800/80 text-white px-3 py-1.5 rounded-lg text-sm flex items-center group hover:bg-bcg-gray-700/80 transition-colors duration-200"
//                   >
//                     {skill}
//                     <button 
//                       type="button"
//                       onClick={() => handleSkillRemove(index)}
//                       className="ml-2 text-bcg-gray-400 hover:text-bcg-mint transition-colors duration-200"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
            
//             <div className="mt-2 flex items-center">
//               <span className="text-sm text-bcg-gray-300 mr-2">Priority:</span>
//               <select 
//                 name="skills_priority"
//                 value={formData.skills_priority}
//                 onChange={handleChange}
//                 className="text-sm rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white shadow-sm p-2 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="critical">Critical</option>
//               </select>
//             </div>
//           </div>
          
//           {/* Education */}
//           <div>
//             <label className="block text-sm font-medium text-bcg-gray-300">Education</label>
//             <input 
//               type="text" 
//               name="education"
//               value={formData.education}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               placeholder="e.g., Bachelor's degree in Computer Science"
//             />
//             <div className="mt-2 flex items-center">
//               <span className="text-sm text-bcg-gray-300 mr-2">Priority:</span>
//               <select 
//                 name="education_priority"
//                 value={formData.education_priority}
//                 onChange={handleChange}
//                 className="text-sm rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white shadow-sm p-2 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="critical">Critical</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             <div>
//               <label className="block text-sm font-medium text-bcg-gray-300">Number of Positions</label>
//               <input 
//                 type="number" 
//                 name="number_of_positions"
//                 value={formData.number_of_positions}
//                 onChange={handleChange}
//                 min="1"
//                 className="mt-1 block w-full rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-bcg-gray-300">Closing Date</label>
//               <input 
//                 type="date" 
//                 name="closing_date"
//                 value={formData.closing_date}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-xl border-bcg-gray-600 bg-bcg-gray-800/50 text-white placeholder-bcg-gray-400 shadow-sm p-3 focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-200"
//               />
//             </div>
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-bcg-black bg-bcg-mint hover:bg-bcg-mint-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bcg-mint transition-all duration-200 ${
//                 loading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bcg-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating Job...
//                 </span>
//               ) : (
//                 'Create Job Listing'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JobCreationForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const JobCreationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    closing_date: '',
    number_of_positions: 1,
    reference_number: '',
    requirements: '',
    education: '',
    skills: [],
    skills_priority: 'medium',
    requirements_priority: 'medium',
    education_priority: 'medium'
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSkillAdd = () => {
    if (newSkill.trim() !== '') {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };
  
  const handleSkillRemove = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
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
      
      const data = await response.json();
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Job Listing</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title*</label>
          <input 
            type="text" 
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description*</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            required
          ></textarea>
        </div>
        
        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <textarea 
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          ></textarea>
          <div className="mt-1 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Priority:</span>
            <select 
              name="requirements_priority"
              value={formData.requirements_priority}
              onChange={handleChange}
              className="text-sm rounded border-gray-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        
        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <div className="flex mt-1">
            <input 
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="block w-full rounded-l-md border-gray-300 shadow-sm p-2"
              placeholder="Add a skill"
            />
            <button 
              type="button"
              onClick={handleSkillAdd}
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
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center"
                >
                  {skill}
                  <button 
                    type="button"
                    onClick={() => handleSkillRemove(index)}
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
              onChange={handleChange}
              className="text-sm rounded border-gray-300"
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
          <label className="block text-sm font-medium text-gray-700">Education</label>
          <input 
            type="text" 
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            placeholder="e.g., Bachelor's degree in Computer Science"
          />
          <div className="mt-1 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Priority:</span>
            <select 
              name="education_priority"
              value={formData.education_priority}
              onChange={handleChange}
              className="text-sm rounded border-gray-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        
        {/* Additional Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Closing Date</label>
            <input 
              type="date" 
              name="closing_date"
              value={formData.closing_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Positions</label>
            <input 
              type="number" 
              name="number_of_positions"
              value={formData.number_of_positions}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference Number</label>
          <input 
            type="text" 
            name="reference_number"
            value={formData.reference_number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Job Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobCreationForm;