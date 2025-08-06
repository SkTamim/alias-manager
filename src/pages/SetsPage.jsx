// src/pages/SetsPage.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  FiEdit,
  FiFolder,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi'; // UPDATED: Using react-icons
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { db } from '../../firebaseConfig';
import { AlertModal } from '../components/AlertModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Loader } from '../components/Loader';
import { Logo } from '../components/Logo';
import { SetModal } from '../components/SetModal';
import { useAuth } from '../contexts/AuthContext';

// --- Helper Components ---

const EmptyState = ({ onCreate }) => (
    <div className="text-center bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl p-12 mt-8">
        <FiFolder className="mx-auto h-16 w-16 text-gray-600" />
        <h3 className="mt-6 text-2xl font-bold text-white">No Alias Sets Found</h3>
        <p className="mt-2 text-gray-400 max-w-md mx-auto">Create your first set to start organizing your aliases. For example, "Jewelry Design" or "Architecture".</p>
        <div className="mt-8 flex justify-center">
            <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
                <FiPlus /> Create Your First Set
            </button>
        </div>
    </div>
);

// --- Main Sets Page Component ---
export default function SetsPage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [aliasSets, setAliasSets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSet, setEditingSet] = useState(null);
    const [alertProps, setAlertProps] = useState({ isOpen: false, title: '', message: '' });
    const [confirmProps, setConfirmProps] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        if (!currentUser) return;
        setIsLoading(true);
        const setsCollectionRef = collection(db, 'users', currentUser.uid, 'aliasSets');
        const unsubscribe = onSnapshot(setsCollectionRef, snapshot => {
            const setsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAliasSets(setsData.sort((a, b) => a.name.localeCompare(b.name)));
            setIsLoading(false);
        }, error => {
            console.error("Error fetching alias sets:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const getSetsCollectionRef = () => collection(db, 'users', currentUser.uid, 'aliasSets');

    const handleSaveSet = async (name, id = null) => {
        try {
            if (id) {
                await updateDoc(doc(db, 'users', currentUser.uid, 'aliasSets', id), { name });
            } else {
                await addDoc(getSetsCollectionRef(), { name });
            }
        } catch (error) {
            console.error("Error saving set:", error);
            setAlertProps({ isOpen: true, title: "Save Error", message: "Could not save the alias set." });
        }
        setIsModalOpen(false);
        setEditingSet(null);
    };

    const handleDeleteSet = (id, name) => {
        setConfirmProps({
            isOpen: true,
            title: 'Delete Alias Set',
            message: `Are you sure you want to delete the set "${name}"? All aliases within this set will also be deleted. This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    const aliasesPath = collection(db, 'users', currentUser.uid, 'aliasSets', id, 'aliases');
                    const aliasSnapshot = await getDocs(aliasesPath);
                    const batch = writeBatch(db);
                    aliasSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    const setDocRef = doc(db, 'users', currentUser.uid, 'aliasSets', id);
                    batch.delete(setDocRef);
                    await batch.commit();
                } catch (error) {
                    console.error("Error deleting set and its aliases:", error);
                    setAlertProps({ isOpen: true, title: "Delete Error", message: "Could not delete the alias set. Please try again." });
                }
            }
        });
    };

    const handleLogout = () => {
        setConfirmProps({
            isOpen: true,
            title: 'Logout',
            message: 'Are you sure you want to log out?',
            onConfirm: async () => {
                try {
                    await logout();
                    navigate('/');
                } catch (error) { console.error("Failed to log out", error); }
            }
        });
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8 font-sans">
            <SetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSet} setToEdit={editingSet} />
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Your Alias Sets</h2>
                        <button onClick={() => { setEditingSet(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors">
                            <FiPlus /> Create New Set
                        </button>
                    </div>

                    {isLoading ? <Loader text="Loading your sets..." /> : (
                        aliasSets.length === 0 ? <EmptyState onCreate={() => setIsModalOpen(true)} /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {aliasSets.map(set => (
                                    <div key={set.id} className="relative group">
                                        <Link to={`/dashboard/${set.id}`} className="block bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 transition-all duration-300 hover:bg-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-1">
                                            <h3 className="text-xl font-bold text-white truncate transition-colors group-hover:text-blue-400">{set.name}</h3>
                                            <div className="mt-4 inline-block bg-gray-700 text-gray-300 font-semibold py-1 px-3 rounded-full text-sm transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                                Manage Aliases →
                                            </div>
                                        </Link>
                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button onClick={() => { setEditingSet(set); setIsModalOpen(true); }} className="p-2 rounded-md text-gray-400 hover:text-yellow-400 hover:bg-gray-700" title="Rename Set">
                                                <FiEdit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDeleteSet(set.id, set.name)} className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-700" title="Delete Set">
                                                <FiTrash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </main>
            </div>
        </div>
    );
}