import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./components/sidebar";
import Navbar from "./components/Navbar";
import JobApplicationForm from "./components/JobApplicationForm";
import ApplicantListing from "./components/applicantslisting";
import JobListingTable from "./components/joblisting";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import authService from "./services/authService";
import Dashboard from "./components/Dashboard";

// Layout component with sidebar and navbar
const DashboardLayout = ({ children }) => (
  <>
    {/* <Navbar /> */}
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
            {/* Public routes */}
            <Route
              path="/"
              element={
                <div className="flex-1 flex justify-center items-center p-6">
                  <JobApplicationForm />
                </div>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute recruiterOnly={true} />}>
              {/* Admin Dashboard */}
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

              {/* Applicants */}
              <Route
                path="/applicant"
                element={
                  <DashboardLayout>
                    <ApplicantListing />
                  </DashboardLayout>
                }
              />

              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <DashboardLayout>
                    <Dashboard/>
                  </DashboardLayout>
                }
              />

              {/* Jobs */}
              <Route
                path="/jobs"
                element={
                  <DashboardLayout>
                    <JobListingTable />
                  </DashboardLayout>
                }
              />

              {/* Applicants Management */}
              <Route
                path="/applicants"
                element={
                  // <DashboardLayout>
                    <div className="flex-1 flex justify-center items-center">
                      <h1 className="text-2xl">Applicants Management</h1>
                    </div>
                  // </DashboardLayout>
                }
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;