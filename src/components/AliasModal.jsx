// src/components/AliasModal.jsx
import React, {
  useEffect,
  useState,
} from 'react';

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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-[#1f2937] rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit Alias' : 'Create New Alias'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="key" className="block text-gray-300 text-sm font-bold mb-2">Alias (Shortcut):</label>
                        <input type="text" id="key" value={formData.key} onChange={handleChange} placeholder="e.g., BU" className="w-full px-3 py-2 rounded-lg border bg-gray-700 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="command" className="block text-gray-300 text-sm font-bold mb-2">Command Macro:</label>
                        <input type="text" id="command" value={formData.command} onChange={handleChange} placeholder="e.g., ! _BooleanUnion" className="w-full px-3 py-2 rounded-lg border bg-gray-700 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">Description:</label>
                        <textarea id="description" value={formData.description} onChange={handleChange} placeholder="e.g., Joins two or more solids together." rows="3" className="w-full px-3 py-2 rounded-lg border bg-gray-700 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Alias</button>
                    </div>
                </form>
            </div>
        </div>
    );
};