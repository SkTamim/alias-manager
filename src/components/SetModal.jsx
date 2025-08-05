// src/components/SetModal.jsx
import React, {
  useEffect,
  useState,
} from 'react';

export const SetModal = ({ isOpen, onClose, onSave, setToEdit }) => {
    const [name, setName] = useState('');
    const isEditMode = !!setToEdit;

    useEffect(() => {
        if (isOpen) {
            setName(isEditMode ? setToEdit.name : '');
        }
    }, [isOpen, setToEdit, isEditMode]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim(), setToEdit ? setToEdit.id : null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-[#1f2937] rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Rename Alias Set' : 'Create New Alias Set'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="setName" className="block text-gray-300 text-sm font-bold mb-2">Set Name:</label>
                        <input
                            type="text"
                            id="setName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Jewelry Design"
                            className="w-full px-3 py-2 rounded-lg border bg-gray-700 border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};