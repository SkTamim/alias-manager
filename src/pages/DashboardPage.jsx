// src/pages/DashboardPage.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { db } from '../../firebaseConfig'; // Ensure this path is correct
import { AlertModal } from '../components/AlertModal';
import { AliasModal } from '../components/AliasModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Loader } from '../components/Loader';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

// --- SVG Icons for Buttons ---
const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const ImportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" /><path fillRule="evenodd" d="M12 2.5A2.5 2.5 0 0114.5 5v1.256a.25.25 0 00.25.25h2.5a.25.25 0 00.25-.25V5A2.5 2.5 0 0117.5 2.5h-5.5zM8.5 5a.5.5 0 000 1h3a.5.5 0 000-1h-3zM5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3H5.25zM12 10a.75.75 0 00-1.5 0v2.25H8.25a.75.75 0 000 1.5h2.25V16a.75.75 0 001.5 0v-2.25h2.25a.75.75 0 000-1.5H12V10z" clipRule="evenodd" /></svg>;
const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a.75.75 0 01.75.75v.518l3.975 2.14a.75.75 0 01.275.92l-1.5 2.5a.75.75 0 01-1.1-.64v-2.134l-2.25.964a.75.75 0 01-.9 0l-2.25-.964v2.134a.75.75 0 01-1.1.64l-1.5-2.5a.75.75 0 01.275-.92L9.25 4.268V3.75A.75.75 0 0110 3zM5 13.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM5.75 15.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z" /></svg>;


const EmptyState = ({ onCreate, onImport }) => (
    <div className="text-center bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl p-12 mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
        <h3 className="mt-6 text-2xl font-bold text-white">Your Dashboard is Empty</h3>
        <p className="mt-2 text-gray-400 max-w-md mx-auto">Get started by creating your first alias or importing an existing `.txt` file from Rhino or Matrix.</p>
        <div className="mt-8 flex justify-center gap-4">
            <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
                <CreateIcon /> Create New Alias
            </button>
            <button onClick={onImport} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
                <ImportIcon /> Import from .txt
            </button>
        </div>
    </div>
);

const commandDictionary = { 'zoom': { command: '! _Zoom', description: 'Zoom view.' }, 'ze': { command: "! '_Zoom _Extents", description: 'Zoom to all extents.' }, 'zs': { command: "! '_Zoom _Selected", description: 'Zoom to selected objects.' }, 'split': { command: '! _Split', description: 'Split an object.' }, 'offsetsrf': { command: '! _OffsetSrf', description: 'Offset a surface.' }, 'planar': { command: "! '_PlanarSrf", description: 'Create a planar surface from curves.' }, 'move': { command: '! _Move', description: 'Move objects.' }, 'ungroup': { command: '! _Ungroup', description: 'Ungroup selected objects.' }, 'pointson': { command: '! _PointsOn', description: 'Turn on control points.' }, 'pointsoff': { command: '! _PointsOff', description: 'Turn off control points.' }, 'join': { command: '! _Join', description: 'Join objects together.' }, 'lock': { command: '! _Lock', description: 'Lock objects.' }, 'hide': { command: '! _Hide', description: 'Hide objects.' }, 'group': { command: '! _Group', description: 'Group objects.' }, 'trim': { command: '! _Trim', description: 'Trim objects.' }, 'loft': { command: '! _Loft', description: 'Create a surface by lofting curves.' }, 'revolve': { command: '! _Revolve', description: 'Revolve a curve to create a surface.' }, 'cap': { command: '! _Cap', description: 'Cap open polysurfaces.' }, 'booleanunion': { command: '! _BooleanUnion', description: 'Join solids with a boolean union.' }, 'booleandifference': { command: '! _BooleanDifference', description: 'Subtract solids with a boolean difference.' }, 'filletedge': { command: '! _FilletEdge', description: 'Create a rounded fillet on edges.' }};

export default function DashboardPage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [aliases, setAliases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingAlias, setEditingAlias] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    const [alertProps, setAlertProps] = useState({ isOpen: false, title: '', message: '' });
    const [confirmProps, setConfirmProps] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        if (!currentUser) return;
        setIsLoading(true);
        const userAliasesCollectionRef = collection(db, 'users', currentUser.uid, 'aliases');
        const unsubscribe = onSnapshot(userAliasesCollectionRef, snapshot => {
            setAliases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        }, error => {
            console.error("Error fetching aliases:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const filteredAliases = useMemo(() => {
        return aliases
            .filter(alias => {
                const term = searchTerm.toLowerCase();
                return (alias.key.toLowerCase().includes(term) || alias.command.toLowerCase().includes(term) || (alias.description || '').toLowerCase().includes(term));
            })
            .sort((a, b) => a.key.localeCompare(b.key));
    }, [aliases, searchTerm]);
    
    const handleLogout = () => {
        setConfirmProps({
            isOpen: true,
            title: 'Logout',
            message: 'Are you sure you want to log out?',
            onConfirm: async () => {
                try {
                    await logout();
                    navigate('/');
                } catch (error) {
                    console.error("Failed to log out", error);
                }
            }
        });
    };
    
    const getCollectionRef = () => collection(db, 'users', currentUser.uid, 'aliases');

    const handleSaveAlias = async (aliasData) => {
        const { id, ...data } = aliasData;
        try {
            if (id) {
                await updateDoc(doc(db, 'users', currentUser.uid, 'aliases', id), data);
            } else {
                await addDoc(getCollectionRef(), data);
            }
        } catch (error) {
            console.error("Error saving alias:", error);
            setAlertProps({ isOpen: true, title: "Save Error", message: "Could not save the alias. Please try again." });
        }
        setIsModalOpen(false);
        setEditingAlias(null);
    };
    
    const handleDeleteAlias = (id, key) => {
        setConfirmProps({
            isOpen: true,
            title: 'Delete Alias',
            message: `Are you sure you want to delete the alias "${key}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'users', currentUser.uid, 'aliases', id));
                } catch (error) {
                    console.error("Error deleting alias:", error);
                    setAlertProps({ isOpen: true, title: "Delete Error", message: "Could not delete the alias. Please try again." });
                }
            }
        });
    };

    const handleExportTxt = () => {
         if (aliases.length === 0) {
            setAlertProps({ isOpen: true, title: "Export Empty", message: "There are no aliases to export." });
            return;
        }
        const content = aliases.map(a => `${a.key} "${a.command}"`).join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Rhino_Aliases.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target.result;
            const parsedAliases = [];
            content.split(/\r?\n/).forEach(line => {
                line = line.trim();
                if (!line || line.startsWith("'")) return;
                const parts = line.split(/\s+/);
                const key = parts[0];
                let command = parts.slice(1).join(' ').replace(/"/g, '');
                let description = '';
                const simpleCommand = command.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (commandDictionary[simpleCommand]) {
                    command = commandDictionary[simpleCommand].command;
                    description = commandDictionary[simpleCommand].description;
                } else if (!command.startsWith("! _")) {
                    command = `! _${command}`;
                }
                if(key) parsedAliases.push({ key, command, description });
            });

            if (parsedAliases.length > 0) {
                setConfirmProps({
                    isOpen: true,
                    title: 'Import Aliases',
                    message: `Found ${parsedAliases.length} aliases. This will ADD them to your current list. Do you want to continue?`,
                    onConfirm: async () => {
                        try {
                            const batch = writeBatch(db);
                            parsedAliases.forEach(alias => {
                                const newDocRef = doc(getCollectionRef());
                                batch.set(newDocRef, alias);
                            });
                            await batch.commit();
                            setAlertProps({ isOpen: true, title: "Import Successful", message: `${parsedAliases.length} aliases have been added to your dashboard.` });
                        } catch (error) {
                            console.error("Error during batch import:", error);
                            setAlertProps({ isOpen: true, title: "Import Failed", message: "Could not import aliases. Please check the console." });
                        }
                    }
                });
            } else {
                setAlertProps({ isOpen: true, title: "Import Failed", message: "Could not find any valid aliases in the selected file." });
            }
        };
        reader.readAsText(file);
        e.target.value = null; 
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8 font-sans">
            {isModalOpen && <AliasModal alias={editingAlias} onClose={() => setIsModalOpen(false)} onSave={handleSaveAlias} />}
            <AlertModal isOpen={alertProps.isOpen} onClose={() => setAlertProps({ ...alertProps, isOpen: false })} title={alertProps.title}>{alertProps.message}</AlertModal>
            <ConfirmModal isOpen={confirmProps.isOpen} onClose={() => setConfirmProps({ ...confirmProps, isOpen: false })} onConfirm={confirmProps.onConfirm} title={confirmProps.title}>{confirmProps.message}</ConfirmModal>

            <div className="container mx-auto max-w-7xl">
                <header className="flex flex-col md:flex-row justify-between items-center pb-6 mb-8 gap-4 border-b border-gray-800">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <img src={currentUser?.photoURL} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-700" />
                        <span className="text-gray-400 hidden sm:inline">{currentUser?.email}</span>
                        <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Logout</button>
                    </div>
                </header>
                <main>
                    {isLoading ? (
                        <Loader text="Loading your aliases..." />
                    ) : aliases.length === 0 ? (
                        <EmptyState 
                            onCreate={() => setIsModalOpen(true)}
                            onImport={() => fileInputRef.current.click()}
                        />
                    ) : (
                        <>
                            {/* Controls */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <div className="relative w-full md:w-2/5">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search your aliases..." className="w-full pl-11 pr-4 py-3 rounded-lg border bg-gray-800 border-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50" />
                                </div>
                                <div className="flex gap-3 flex-wrap justify-center">
                                    {/* UPDATED: Removed hover animations */}
                                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors"><CreateIcon /> Create New</button>
                                    <button onClick={() => fileInputRef.current.click()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors"><ImportIcon /> Import</button>
                                    <button onClick={handleExportTxt} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors"><ExportIcon /> Export</button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto bg-gray-800/50 border border-gray-800 rounded-lg shadow-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-gray-700/50 text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4">Alias</th>
                                            <th className="px-6 py-4">Command Macro</th>
                                            <th className="px-6 py-4">Description</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {filteredAliases.map((alias) => (
                                            <tr key={alias.id} className="hover:bg-gray-800">
                                                <td className="px-6 py-4 font-mono text-blue-400 font-semibold">{alias.key}</td>
                                                <td className="px-6 py-4 font-mono text-gray-300">{alias.command}</td>
                                                <td className="px-6 py-4 text-gray-400">{alias.description}</td>
                                                <td className="px-6 py-4 text-center">
                                                    {/* UPDATED: Beautified Edit and Delete buttons */}
                                                    <button onClick={() => { setEditingAlias(alias); setIsModalOpen(true); }} className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 font-bold py-1 px-3 rounded-full text-xs transition-colors">Edit</button>
                                                    <button onClick={() => handleDeleteAlias(alias.id, alias.key)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold py-1 px-3 rounded-full text-xs ml-2 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                     <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".txt" />
                </main>
            </div>
        </div>
    );
}