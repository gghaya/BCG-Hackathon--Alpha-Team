import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./components/sidebar"
import Navbar from "./components/Navbar"
import JobApplicationForm from "./components/JobApplicationForm";
import ApplicantListing  from "./components/applicantslisting";
import JobListingTable from "./components/joblisting"
// Layout component with sidebar and navbar
const DashboardLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="flex flex-1">
      <SideBar />
      <div className="w-full pl-[20%] pt-16">
        {children}
      </div>
    </div>
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <main className="flex flex-1">
          <Routes>
            {/* Homepage without sidebar */}
            <Route
              path="/"
              element={
                <div className="flex-1 flex justify-center items-center p-6">
                  <JobApplicationForm />
                </div>
              }
            />
            
            {/* Routes with sidebar */}
            <Route
              path="/admin"
              element={
                <DashboardLayout>
                  <div className="flex-1 flex justify-center items-center">
                    <h1 className="text-2xl">Admin Panel</h1>
                  </div>
                </DashboardLayout>
              }
            />
            
            <Route
              path="/applicant"
              element={
                <DashboardLayout>
                  <ApplicantListing />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <div className="flex-1 flex justify-center items-center">
                    <h1 className="text-2xl">Dashboard</h1>
                  </div>
                </DashboardLayout>
              }
            />

            <Route
              path="/jobs"
              element={
                <DashboardLayout>
                  {/* <div className="flex-1 flex justify-center items-center"> */}
                    <JobListingTable/>
                  {/* </div> */}
                </DashboardLayout>
              }
            />

            <Route
              path="/applicants"
              element={
                <DashboardLayout>
                  <div className="flex-1 flex justify-center items-center">
                    <h1 className="text-2xl">Applicants Management</h1>
                  </div>
                </DashboardLayout>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
