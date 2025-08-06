// src/components/dashboard/EmptyState.jsx
import React from 'react';

import {
  FiPlus,
  FiUpload,
} from 'react-icons/fi';

export const EmptyState = ({ onCreate, onImport }) => (
    <div className="text-center bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl p-12 mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-6 text-2xl font-bold text-white">This Alias Set is Empty</h3>
        <p className="mt-2 text-gray-400 max-w-md mx-auto">
            Get started by creating your first alias or importing an existing `.txt` file.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <button
                onClick={onCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
                <FiPlus /> Create New Alias
            </button>
            <button
                onClick={onImport}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
                <FiUpload /> Import from .txt
            </button>
        </div>
    </div>
);