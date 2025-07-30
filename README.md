# VS Code Side Panel Extension

A VS Code extension that displays a list of workspace files in a side panel. Clicking a file opens it in the editor.

---

## Installing the Extension

There are two common ways users can install your extension:

---

### 🔧 Option 1: Install from VSIX (Recommended for Sharing)

If you've built a `.vsix` file (using `vsce package`), users can install it locally:

1. Download the `.vsix` file (e.g., `extension-side-panel-1.0.0.vsix`).
2. In VS Code, open the Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P` on macOS).
3. Choose: **Extensions: Install from VSIX...**
4. Select the downloaded `.vsix` file.
5. Installed! Now run `Show Side Panel` from the Command Palette.

---

### Option 2: Run from Source (for Developers)

1. Clone the repository and open it in **VS Code**:

   ```bash
   git clone https://github.com/GeraldoTM/extension-side-panel.git
   cd extension-side-panel
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile the extension:

   ```bash
   npm run compile
   ```

4. Press `F5` in VS Code to launch the **Extension Development Host**.

5. Open the **Command Palette** and run: **Show Side Panel**

6. Done!

---

### File Types Displayed

This extension shows the following file types in your workspace:

* `.js`, `.ts`, `.py`, `.md`

Folders like `node_modules`, `.git`, `.vscode`, etc. are excluded by default.

---

### Build Your Own `.vsix`

If you're a developer and want to build your own `.vsix`:

1. Install the VSCE CLI:

   ```bash
   npm install -g @vscode/vsce
   ```

2. Package the extension:

   ```bash
   vsce package
   ```

This creates a `.vsix` file you can share or install locally. 