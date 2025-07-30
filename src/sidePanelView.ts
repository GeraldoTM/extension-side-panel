import path from "path";
import * as vscode from "vscode";
import { scanWorkspaceFiles } from "./util";

export class SidePanelViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'sidePanelView';

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView
  ): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true, 
    };

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (workspacePath){
      const files: string[] = []
      scanWorkspaceFiles(workspacePath, ['.js', '.ts', '.py', '.md', '.json', '.html', '.css'], files);
      const relativeFiles = files.map(file => vscode.workspace.asRelativePath(file));
      
      webviewView.webview.html = this.getHtml(relativeFiles);

      // Handle messages from webview
      webviewView.webview.onDidReceiveMessage(message => {
        if(message.command === "openFile") {
          const filePath = vscode.Uri.file(path.join(workspacePath, message.file));
          vscode.workspace.openTextDocument(filePath).then(doc => {
            vscode.window.showTextDocument(doc);
          });
        }
      });
    } else {
      webviewView.webview.html = this.getHtml([]);
    }
  }

  private getHtml(files: string[]): string {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 16px;
            font-size: 13px;
          }
          
          .header {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
          }
          
          .title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--vscode-editor-foreground);
          }
          
          .search-container {
            position: relative;
            margin-bottom: 16px;
          } 
          
          .file-count {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 12px;
          }
          
          .file-list {
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }
          
          .file-item {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            margin-bottom: 2px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.1s ease;
            font-size: 12px;
          }
          
          .file-item:hover {
            background-color: var(--vscode-list-hoverBackground);
          }
          
          .file-item.selected {
            background-color: var(--vscode-list-activeSelectionBackground);
            color: var(--vscode-list-activeSelectionForeground);
          }
          
          .file-icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            flex-shrink: 0;
          }
          
          .file-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .file-path {
            color: var(--vscode-descriptionForeground);
            font-size: 11px;
            margin-top: 2px;
          }
          
          .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--vscode-descriptionForeground);
          }
          
          .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }
          
          .file-type-badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 3px;
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            margin-left: 8px;
          }
        </style>
      </head>
      <body> 
        <div class="header">
          <div class="title">📁 File Explorer</div> 
          <div class="file-count" id="fileCount">${files.length} files found</div>
        </div>
        
        <div class="file-list" id="fileList">
          ${files.length === 0 ? this.getEmptyState() : this.renderFileList(files)}
        </div>
        
        <script>
          const vscode = acquireVsCodeApi();
          
          function openFile(filePath) {
            vscode.postMessage({
              command: 'openFile',
              file: filePath
            });
          }
          
          // Initialize
          vscode.postMessage({ command: 'ready' });
        </script>
      </body>
      </html>`;
  }
  
  private getEmptyState(): string {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📁</div>
        <div>No workspace found</div>
        <div style="font-size: 11px; margin-top: 8px;">Open a folder to see files</div>
      </div>
    `;
  }
  
  private renderFileList(files: string[]): string {
    return files.map(file => {
      const fileName = file.split('/').pop() || file;
      const filePath = file;
      const icon = this.getFileIcon(fileName);
      const badge = this.getFileTypeBadge(fileName);
      
      return `
        <div class="file-item" onclick="openFile('${file}')">
          <div class="file-icon">${icon}</div>
          <div style="flex: 1; min-width: 0;">
            <div class="file-name">${fileName}</div>
            <div class="file-path">${filePath}</div>
          </div>
          <div class="file-type-badge">${badge}</div>
        </div>
      `;
    }).join('');
  }
  
  private getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const icons: { [key: string]: string } = {
      'js': '📄',
      'ts': '📄',
      'py': '🐍',
      'md': '📝',
      'json': '⚙️',
      'html': '🌐',
      'css': '🎨',
      'default': '📄'
    };
    return icons[ext] || icons.default;
  }
  
  private getFileTypeBadge(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ext.toUpperCase();
  }
}