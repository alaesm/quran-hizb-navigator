import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white fixed top-0 left-0 p-4">
      <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
      <ul>
        <li className="mb-2">
          <a href="#hizb-display" className="hover:underline">Hizb Display</a>
        </li>
        <li className="mb-2">
          <a href="#hizb-random-selector" className="hover:underline">Hizb Random Selector</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;