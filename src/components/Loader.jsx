// src/components/Loader.jsx
import React from 'react';

export const Loader = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center my-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400">{text}</p>
    </div>
);