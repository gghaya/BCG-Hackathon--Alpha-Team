import React from "react";
import JobApplicationForm from "./components/JobApplicationForm";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Sticky Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 shadow-lg text-center text-2xl font-bold top-0 z-10">
        Hackathon Job Portal
      </header>

      {/* Main content */}
      <main className="flex flex-1 justify-center items-center p-6">
        <JobApplicationForm />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 text-sm">
        &copy; 2025 Hackathon - All Rights Reserved
      </footer>
    </div>
  );
}

export default App;















