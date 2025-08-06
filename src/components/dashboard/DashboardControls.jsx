// src/components/dashboard/DashboardControls.jsx
import React from 'react';

import {
  FiDownload,
  FiPlus,
  FiSearch,
  FiUpload,
} from 'react-icons/fi';

export const DashboardControls = ({ searchTerm, onSearch, onCreate, onImport, onExport }) => (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-2/5">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
                type="text"
                value={searchTerm}
                onChange={onSearch}
                placeholder="Search this set..."
                className="w-full pl-11 pr-4 py-3 rounded-lg border bg-gray-800 border-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
            />
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors">
                <FiPlus /> Create New
            </button>
            <button onClick={onImport} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors">
                <FiUpload /> Import
            </button>
            <button onClick={onExport} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors">
                <FiDownload /> Export
            </button>
        </div>
    </div>
);