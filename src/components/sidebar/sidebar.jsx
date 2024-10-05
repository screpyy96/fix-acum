import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaBriefcase, FaStar, FaImages, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Worker Dashboard</h2>
      </div>
      <ul className="flex-grow mt-4">
        {[
          { name: 'Dashboard', icon: FaHome, tab: 'dashboard' },
          { name: 'Company Description', icon: FaBriefcase, tab: 'company-description' },
          { name: 'Reviews', icon: FaStar, tab: 'reviews' },
          { name: 'Portfolio', icon: FaImages, tab: 'portfolio' },
          { name: 'Settings', icon: FaCog, tab: 'settings' },
        ].map(({ name, icon: Icon, tab }) => (
          <li key={tab}>
            <button
              onClick={() => handleTabClick(tab)}
              className={`flex items-center w-full p-3 hover:bg-gray-700 transition-colors ${activeTab === tab ? 'bg-gray-700' : ''}`}
            >
              <Icon className="mr-3 text-gray-300" />
              <span className="text-gray-200">{name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="p-4 border-t border-gray-700">
        <Link href="/logout" className="flex items-center text-gray-300 hover:text-white transition-colors">
          <FaSignOutAlt className="mr-3" />
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        >
          <FaBars />
        </button>
      )}
      <div
        className={`
          ${isMobile ? 'fixed inset-0 z-40' : 'relative w-64'}
          ${isMobile && !isOpen ? 'hidden' : 'block'}
          bg-gray-800 text-white overflow-y-auto
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;