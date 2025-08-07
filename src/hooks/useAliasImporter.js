// src/hooks/useAliasImporter.js
import { useState } from 'react';

import {
  doc,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../../firebaseConfig';
import {
  parseAliasFile,
} from '../utils/aliasParser'; // <-- NEW: Import the parser

export const useAliasImporter = (
    aliases,
    getAliasesCollectionRef,
    setAlertProps,
    setConfirmProps
) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const importAliases = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            setIsProcessing(true);
            try {
                const content = event.target.result;

                // --- Step 1: Use the new parser utility ---
                const parsedAliases = parseAliasFile(content);

                if (parsedAliases.length === 0) {
                    setAlertProps({ isOpen: true, title: "Import Error", message: "No valid aliases could be found in the file." });
                    return;
                }

                // --- Step 2: Filter Duplicates ---
                const existingKeys = new Set(aliases.map(a => a.key.toLowerCase()));
                const newAliases = parsedAliases.filter(alias => !existingKeys.has(alias.key.toLowerCase()));
                const skippedCount = parsedAliases.length - newAliases.length;

                // --- Step 3: Confirm with User ---
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

            } catch (error) {
                console.error("Error during import:", error);
                setAlertProps({ isOpen: true, title: "Import Error", message: "An error occurred during the import process." });
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsText(file);
    };

    return { isProcessing, importAliases };
};