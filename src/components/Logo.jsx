// src/components/Logo.jsx
import React from 'react';

import { Link } from 'react-router-dom';

// This is your reusable logo component.
// It uses react-router's Link component to navigate to the home page without a full page reload.
export const Logo = () => (
    <Link to="/" className="text-3xl font-bold tracking-tight cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Alias
        </span>
        <span className="text-gray-400 font-light ms-1">
            Manager
        </span>
    </Link>
);