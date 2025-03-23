// components/Sidebar.js
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaSuitcase, FaUserFriends } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gradient-to-b from-blue-600 to-indigo-600 text-white w-[20%] h-full p-6 flex flex-col justify-between shadow-lg">
      {/* Top: Profile & Navigation */}
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full mb-2" />
          <span className="font-semibold text-white">Ghizlane Ghaya</span>
        </div>

        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive("/dashboard") ? "bg-yellow-400 text-black" : "hover:bg-blue-500"
            }`}
          >
            <FaTachometerAlt /> Dashboard
          </Link>

          <Link
            to="/jobs"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive("/jobs") ? "bg-yellow-400 text-black" : "hover:bg-blue-500"
            }`}
          >
            <FaSuitcase /> Jobs
          </Link>

          <Link
            to="/applicants"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive("/applicants") ? "bg-yellow-400 text-black" : "hover:bg-blue-500"
            }`}
          >
            <FaUserFriends /> Applicants
          </Link>
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div className="px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-yellow-500 hover:text-black rounded-md w-full"
        >
          <BiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}
