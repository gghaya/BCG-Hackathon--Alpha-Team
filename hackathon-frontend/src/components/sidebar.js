// components/Sidebar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaSuitcase, FaUserFriends } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import authService from "../services/authService";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = (event) => {
    event.preventDefault();
    authService.logout();
    navigate("/login");
  };
  
  const isActive = (path) => location.pathname === path;
  
  // Get user information
  const user = authService.getUser();
  
  const navItems = [
    { path: "/dashboard", icon: <FaTachometerAlt />, text: "Dashboard" },
    { path: "/jobs", icon: <FaSuitcase />, text: "Jobs" },
    { path: "/applicant", icon: <FaUserFriends />, text: "Applicants" }
  ];
  
  return (
    <div className="fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-indigo-600 text-white w-[20%] flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="pt-6 pb-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full mb-2" />
          <span className="font-semibold text-white">{user ? user.username : "User"}</span>
          <span className="text-sm text-gray-300">{user ? user.email : ""}</span>
        </div>
      </div>
      
      {/* Navigation - Centered */}
      <div className="flex-1 flex items-center">
        <nav className="w-full px-6 space-y-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center text-center gap-3 px-4 py-3 rounded-md text-lg transition-colors ${
                isActive(item.path) ? "bg-yellow-400 text-black" : "hover:bg-blue-500"
              }`}
            >
              <div className="w-6 flex justify-center">{item.icon}</div>
              <span className="flex-1 text-left">{item.text}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Logout Button */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-800 hover:bg-yellow-500 hover:text-black rounded-md w-full transition-colors"
        >
          <BiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}