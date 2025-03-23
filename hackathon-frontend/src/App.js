import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./components/sidebar"
import JobApplicationForm from "./components/JobApplicationForm";
import ApplicantListing  from "./components/applicantslisting";

// function App() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* Sticky Header */}
//       <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 shadow-lg text-center text-2xl font-bold top-0 z-10">
//         Hackathon Job Portal
//       </header>

//       {/* Main content */}
//       <main className="flex flex-1 justify-center items-center p-6">
//         <JobApplicationForm />
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center py-4 text-sm">
//         &copy; 2025 Hackathon - All Rights Reserved
//       </footer>
//     </div>
//   );
// }
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 shadow-lg text-center text-2xl font-bold top-0 z-10">
          Hackathon Job Portal
        </header>

        <main className="flex flex-1 p-6">
          <Routes>
            {/* Homepage → JobApplicationForm only */}
            <Route
              path="/"
              element={
                <div className="flex-1 flex justify-center items-center">
                  <JobApplicationForm />
                </div>
              }
            />
            {/* SideBar page */}
            <Route
              path="/admin"
              element={
                <div className="w-4/5">
                  <SideBar />
                  <div className="flex-1 flex justify-center items-center">
                    <h1 className="text-2xl">Admin Panel (just SideBar here)</h1>
                  </div>
                </div>
              }
            />
              {/* SideBar page */}
              <Route
              path="/applicant"
              element={
                <div className="w-4/5">
                  <ApplicantListing />
                  {/* <div className="flex-1 flex justify-center items-center"> */}
                    {/* <h1 className="text-2xl">Admin Panel (just SideBar here)</h1> */}
                  {/* </div> */}
                </div>
              }
            />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 text-sm">
          &copy; 2025 Hackathon - All Rights Reserved
        </footer>
      </div>
    </Router>
  );
}

// export default App;
export default App;