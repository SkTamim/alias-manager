// src/components/dashboard/DashboardHeader.jsx
import React from 'react';

import { FiChevronLeft } from 'react-icons/fi'; // Using Feather Icons
import { Link } from 'react-router-dom';

export const DashboardHeader = ({ currentUser, onLogout }) => (
    <header className="flex flex-col md:flex-row justify-between items-center pb-6 mb-8 gap-4 border-b border-gray-800">
        <div>
            <Link to="/sets" className="inline-flex items-center gap-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 font-semibold py-2 px-4 rounded-lg transition-colors">
                <FiChevronLeft className="h-5 w-5" />
                Back to All Sets
            </Link>
        </div>
        <div className="flex items-center gap-4">
            <img src={currentUser?.photoURL} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-700" />
            <span className="text-gray-400 hidden sm:inline">{currentUser?.email}</span>
            <button onClick={onLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Logout</button>
        </div>
    </header>
);