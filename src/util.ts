
import * as fs from "fs";
import * as path from "path";

const EXCLUDED_FOLDERS = [
    "node_modules",
    "out",
    ".vscode",
    ".git",
    ".idea", 
]

export function scanWorkspaceFiles(folder: string, extensions: string[], files: string[]) {
    if (EXCLUDED_FOLDERS.some(excluded => folder.includes(excluded)))  return files;

    const filesFound = fs.readdirSync(folder);

    for (const file of filesFound) {
        const filePath = path.join(folder, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            scanWorkspaceFiles(filePath, extensions, files);
        } else {
            // Check if file has one of the target extensions
            const fileExt = path.extname(file);
            if (extensions.includes(fileExt)) {
                files.push(filePath);
            }
        }
    }

    return files;
}