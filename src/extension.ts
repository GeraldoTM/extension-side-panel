import * as vscode from "vscode";
import { SidePanelViewProvider } from "./sidePanelView";
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
        }
    }

    return filesFound;
}

export function activate(context: vscode.ExtensionContext) {
    const sidePanelViewProvider = new SidePanelViewProvider(context);
    vscode.window.registerWebviewViewProvider(SidePanelViewProvider.viewType, sidePanelViewProvider)

    context.subscriptions.push(
        vscode.commands.registerCommand("extension.showSidePanel", () => {
            vscode.commands.executeCommand("workbench.view.extension.sidePanel");
        })
    );
}

export function deactivate() {}
