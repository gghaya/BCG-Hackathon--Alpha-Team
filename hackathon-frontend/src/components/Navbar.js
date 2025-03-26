import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-[20%] right-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
