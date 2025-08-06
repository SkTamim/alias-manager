// src/components/dashboard/AliasTable.jsx
import React from 'react';

import {
  FiEdit,
  FiTrash2,
} from 'react-icons/fi';

export const AliasTable = ({ aliases, onEdit, onDelete }) => (
    <div className="overflow-x-auto bg-gray-800/50 border border-gray-800 rounded-lg shadow-lg">
        <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-700/50 text-gray-400">
                <tr>
                    <th className="px-6 py-4 w-16 text-center">#</th>
                    <th className="px-6 py-4">Alias</th>
                    <th className="px-6 py-4">Command Macro</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right pr-8">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
                {aliases.map((alias, index) => (
                    <tr key={alias.id} className="transition-colors hover:bg-gray-800">
                        <td className="px-6 py-4 text-center text-gray-500 font-semibold">{index + 1}</td>
                        <td className="px-6 py-4 font-mono text-blue-400 font-semibold">{alias.key}</td>
                        <td className="px-6 py-4 font-mono text-gray-300">{alias.command}</td>
                        <td className="px-6 py-4 text-gray-400">{alias.description}</td>
                        <td className="px-6 py-4 text-right pr-6">
                            <div className="flex justify-end items-center gap-2">
                                <button onClick={() => onEdit(alias)} className="p-2 rounded-md text-gray-400 hover:text-yellow-400 hover:bg-gray-700 transition-colors" title="Edit Alias">
                                    <FiEdit className="h-5 w-5" />
                                </button>
                                <button onClick={() => onDelete(alias.id, alias.key)} className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors" title="Delete Alias">
                                    <FiTrash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);