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
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { db } from '../../firebaseConfig';
import { AlertModal } from '../components/AlertModal';
import { AliasModal } from '../components/AliasModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { AliasTable } from '../components/dashboard/AliasTable';
import { DashboardControls } from '../components/dashboard/DashboardControls';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { GoToTopButton } from '../components/GoToTopButton';
import { Loader } from '../components/Loader';
import { useAuth } from '../contexts/AuthContext';
import { commandDictionary } from '../data/commandDictionary';

export default function DashboardPage() {
  // --- State Management ---
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { setId } = useParams();
  const [aliases, setAliases] = useState([]);
  const [setName, setSetName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAlias, setEditingAlias] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [alertProps, setAlertProps] = useState({ isOpen: false, title: '', message: '' });
  const [confirmProps, setConfirmProps] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!currentUser || !setId) return;
    setIsLoading(true);
    const setDocRef = doc(db, 'users', currentUser.uid, 'aliasSets', setId);
    const unsubscribeSet = onSnapshot(setDocRef, (doc) => {
      if (doc.exists()) setSetName(doc.data().name);
      else navigate('/sets');
    });
    const aliasesCollectionRef = collection(db, 'users', currentUser.uid, 'aliasSets', setId, 'aliases');
    const unsubscribeAliases = onSnapshot(aliasesCollectionRef, snapshot => {
      setAliases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });
    return () => { unsubscribeSet(); unsubscribeAliases(); };
  }, [currentUser, setId, navigate]);

  // --- Memoized Filtering ---
  const filteredAliases = useMemo(() => {
    return aliases
      .filter(alias => {
        const term = searchTerm.toLowerCase();
        return (alias.key.toLowerCase().includes(term) || alias.command.toLowerCase().includes(term) || (alias.description || '').toLowerCase().includes(term));
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [aliases, searchTerm]);
  
  // --- Event Handlers ---
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

  const getAliasesCollectionRef = () => collection(db, 'users', currentUser.uid, 'aliasSets', setId, 'aliases');

  const handleSaveAlias = async (aliasData) => {
    const { id, ...data } = aliasData;
    const newKey = data.key.trim().toLowerCase();
    const isDuplicate = aliases.some(alias => alias.key.toLowerCase() === newKey && alias.id !== id);
    if (isDuplicate) {
      setAlertProps({ isOpen: true, title: "Duplicate Alias", message: `The alias key "${data.key}" already exists in this set. Please use a unique key.` });
      return;
    }
    try {
      if (id) {
        await updateDoc(doc(getAliasesCollectionRef(), id), data);
      } else {
        await addDoc(getAliasesCollectionRef(), data);
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
          await deleteDoc(doc(getAliasesCollectionRef(), id));
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
    const content = aliases.map(a => `${a.key} "${a.command}"`).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${setName.replace(/\s+/g, "_")}_Aliases.txt`;
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
      const seenKeysInFile = new Set();
      content.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith("'")) return;
        const parts = line.split(/\s+/);
        const key = parts[0];
        let command = parts.slice(1).join(' ').replace(/"/g, '');
        if (key && !seenKeysInFile.has(key.toLowerCase())) {
          seenKeysInFile.add(key.toLowerCase());
          let description = '';
          const simpleCommand = command.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (commandDictionary[simpleCommand]) {
            command = commandDictionary[simpleCommand].command;
            description = commandDictionary[simpleCommand].description;
          } else if (!command.startsWith("! _")) {
            command = `! _${command}`;
          }
          parsedAliases.push({ key, command, description });
        }
      });
      const existingKeys = new Set(aliases.map(a => a.key.toLowerCase()));
      const newAliases = parsedAliases.filter(alias => !existingKeys.has(alias.key.toLowerCase()));
      const skippedCount = parsedAliases.length - newAliases.length;
      if (newAliases.length > 0) {
        let message = `Found ${newAliases.length} new aliases to import.`;
        if (skippedCount > 0) {
          message += `\n\n${skippedCount} duplicate(s) were found and will be skipped.`;
        }
        message += "\n\nDo you want to continue?";
        setConfirmProps({
          isOpen: true,
          title: 'Import Aliases',
          message: message,
          onConfirm: async () => {
            try {
              const batch = writeBatch(db);
              newAliases.forEach(alias => {
                const newDocRef = doc(getAliasesCollectionRef());
                batch.set(newDocRef, alias);
              });
              await batch.commit();
              setAlertProps({ isOpen: true, title: "Import Successful", message: `${newAliases.length} aliases have been added.` });
            } catch (error) {
              console.error("Error during batch import:", error);
              setAlertProps({ isOpen: true, title: "Import Failed", message: "Could not import aliases." });
            }
          }
        });
      } else {
        let message = "Could not find any new aliases to import.";
        if (skippedCount > 0) {
          message += ` All ${skippedCount} aliases from the file already exist in this set.`
        }
        setAlertProps({ isOpen: true, title: "Import Complete", message: message });
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };
  
  const handleCreateNew = () => {
    setEditingAlias(null);
    setIsModalOpen(true);
  };

  const handleEdit = (alias) => {
    setEditingAlias(alias);
    setIsModalOpen(true);
  };

  // --- Render ---
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8 font-sans">
      {/* THE FIX IS HERE: The modal is now conditionally rendered */}
      {isModalOpen && <AliasModal alias={editingAlias} onClose={() => setIsModalOpen(false)} onSave={handleSaveAlias} />}
      
      <AlertModal isOpen={alertProps.isOpen} onClose={() => setAlertProps({ ...alertProps, isOpen: false })} title={alertProps.title}>{alertProps.message}</AlertModal>
      <ConfirmModal isOpen={confirmProps.isOpen} onClose={() => setConfirmProps({ ...confirmProps, isOpen: false })} onConfirm={confirmProps.onConfirm} title={confirmProps.title}>{confirmProps.message}</ConfirmModal>

      <div className="container mx-auto max-w-7xl">
        <DashboardHeader currentUser={currentUser} onLogout={handleLogout} />
        <main>
          {isLoading ? (
            <Loader text="Loading your aliases..." />
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                  <h2 className="text-3xl font-bold text-white mb-6">
                      Managing Set - <span className="text-purple-400">{setName}</span>
                  </h2>
                        {/* NEW: Added Alias Count Display */}
                      <div className=" text-gray-400 text-lg">
                          Total Aliases - <span className="font-bold text-white ms-0.5">{aliases.length}</span>
                      </div>
              </div>
              {aliases.length === 0 ? (
                <EmptyState onCreate={handleCreateNew} onImport={() => fileInputRef.current.click()} />
              ) : (
                <>
                  <DashboardControls
                    searchTerm={searchTerm}
                    onSearch={(e) => setSearchTerm(e.target.value)}
                    aliasCount={aliases.length}
                    onCreate={handleCreateNew}
                    onImport={() => fileInputRef.current.click()}
                    onExport={handleExportTxt}
                  />
                  <AliasTable
                    aliases={filteredAliases}
                    onEdit={handleEdit}
                    onDelete={handleDeleteAlias}
                  />
                </>
              )}
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".txt" />
        </main>
      </div>
      
      <GoToTopButton />
    </div>
  );
}