// src/components/AliasModal.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import {
  FiEdit,
  FiPlus,
} from 'react-icons/fi'; // Using Feather Icons

const initialFormState = { key: '', command: '', description: '' };

export const AliasModal = ({ alias, onClose, onSave }) => {
    const [formData, setFormData] = useState(
        alias ? { key: alias.key, command: alias.command, description: alias.description } : initialFormState
    );
    const isEditMode = !!alias;

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = isEditMode ? { ...alias, ...formData } : formData;
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-[#1f2937] border border-gray-700 rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-900/50 p-2 rounded-full">
                        {isEditMode ? <FiEdit className="w-6 h-6 text-blue-400" /> : <FiPlus className="w-6 h-6 text-blue-400" />}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Alias' : 'Create New Alias'}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="key" className="block text-gray-300 text-sm font-bold mb-2">Alias (Shortcut):</label>
                        <input
                            type="text"
                            id="key"
                            value={formData.key}
                            onChange={handleChange}
                            placeholder="e.g., BU"
                            className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="command" className="block text-gray-300 text-sm font-bold mb-2">Command Macro:</label>
                        <input
                            type="text"
                            id="command"
                            value={formData.command}
                            onChange={handleChange}
                            placeholder="e.g., ! _BooleanUnion"
                            className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">Description:</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g., Joins two or more solids together."
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-md border border-gray-600 shadow-sm bg-gray-700 text-base font-semibold text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-md border border-transparent shadow-sm bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
                        >
                            Save Alias
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};