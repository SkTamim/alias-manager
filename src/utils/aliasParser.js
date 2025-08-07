// src/utils/aliasParser.js

/**
 * Intelligently parses the raw text content of a Rhino alias file.
 * It cleans, formats, and applies best-practice prefixes to commands.
 * @param {string} fileContent The raw string content from the .txt file.
 * @returns {Array} An array of parsed alias objects, e.g., [{ key: 'c', command: '! _Copy', description: '' }]
 */
export function parseAliasFile(fileContent) {
    const parsedAliases = [];
    const seenKeysInFile = new Set();

    const lines = fileContent.split(/\r?\n/);

    lines.forEach(line => {
        line = line.trim();
        // Rule 1: Skip comments and empty lines
        if (!line || line.startsWith("'")) return;

        const parts = line.split(/\s+/);
        // Rule 2: Skip lines that don't have at least a key and a command
        if (parts.length < 2) return;

        const key = parts[0];
        let command = parts.slice(1).join(' ').replace(/"/g, '');

        if (key && !seenKeysInFile.has(key.toLowerCase())) {
            seenKeysInFile.add(key.toLowerCase());

            // Rule 3: Respect existing prefixes
            const hasPrefix = command.startsWith('!') || command.startsWith('_') || command.startsWith("'");

            // Rule 4: Apply best-practice prefix to plain commands
            if (!hasPrefix) {
                command = `! _${command}`;
            }

            parsedAliases.push({ key, command, description: '' });
        }
    });

    return parsedAliases;
}