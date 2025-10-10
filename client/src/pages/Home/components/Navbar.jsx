// components/Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/logo.jpg'; 

const Navbar = ({ links }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
  {/* Navbar Principal (fijo) */}
  <nav className="bg-gray-800 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y Brand */}
            <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <img
                            src={logo}
                            alt="Logo"
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-md bg-white"
                          />
                          <span className="text-2xl font-bold text-gray-800 dark:text-white hidden sm:inline">Terminal SJ</span>
                        </div>
              
              {/* Navigation Links - Desktop */}
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  
                </div>
              </div>
            </div>

            {/* Desktop Menu Right */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                  Login
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
  </nav>

  {/* Espaciador para compensar el navbar fijo (misma altura que el nav) */}
  <div className="h-16" aria-hidden="true" />

      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50  md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeSidebar}
        ></div>
        
        {/* Sidebar Panel */}
        <div className="fixed inset-y-0  left-0 max-w-xs w-full bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <h2 className="text-l text-white font-semibold">Menú</h2>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="px-4 py-6  space-y-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeSidebar}
                className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                {link.label}
              </NavLink>
            ))}
            
            <div className="pt-4 border-t border-gray-700">
              <button className="w-full bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-base font-medium transition duration-300">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;