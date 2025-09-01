# TreeMaker - Browser Extension

<div align="center"><img src="img/icon.png" width="100" height="100" /></div>

TreeMaker is a browser extension designed to simplify creating tree diagrams and visual structures using special symbols, box-drawing characters, and emojis. Perfect for developers, designers, and anyone who needs to create quick visual representations. TreeMaker is compatible with all Chromium-based browsers, for now...

## ✨ Features

- **Intuitive grid interface**: 5×5 logically organized buttons
- **Box-drawing symbols**: Unicode characters for creating frames and structures
- **Useful emojis and symbols**: Icons for folders, documents, checkmarks, and stars
- **Multiple operation modes**:
  - Copy to clipboard
  - Insert directly into text fields
  - Both actions simultaneously
- **Customization**: Choose between emojis or alternative symbols
- **Context menu**: Access settings from the extension icon
- **Informative tooltips**: Description of each symbol on hover

## 🚀 Installation

### Manual Installation

1. Download the latest release (v1.4) from GitHub.
2. Extract the ZIP file to a folder on your computer.
3. Open Chrome and navigate to `chrome://extensions/`.
4. Enable "Developer mode" (toggle in top right corner).
5. Click "Load unpacked" and select the extracted folder.

## 🎮 How to Use

### Basic Usage

1. Click the TreeMaker icon in Chrome's toolbar.
2. A popup will appear with a 5×5 grid of buttons.
3. Click any button to:
   - Copy the symbol to clipboard (depending on configured mode).
   - Insert the symbol directly into the active text field (depending on configured mode).

### Available Symbols

#### Lines, corners and intersections (Rows 1 to 5)

```text
┌ ─ ┬ ─ ┐
├   ┼   ┤
│   │   │
└ ─ ┴ ─ ┘
```

#### Special characters (Row 2)

- `↵` - Enter (new line).
- `_` - Blank space.
- ` ` - Non-breaking space (nbsp).

#### Icons and symbols (Row 3)

- `📂`/`🗁` - Folder (emoji or symbol).
- `📄`/`🗎` - Document (emoji or symbol).

#### Decorative symbols (Row 4)

- `✔` - Check mark.
- `★` - Filled star.
- `☆` - Empty star.

## ⚙️ Configuration

### Changing Operation Mode

1. Right-click the TreeMaker icon
2. Select "Operation mode"
3. Choose between:
   - "Copy only" - Only copies to clipboard
   - "Insert only" - Only inserts into text fields
   - "Copy and insert" - Both actions

### Changing Icon Type

1. Right-click the TreeMaker icon
2. Select "Icon type"
3. Choose between:
   - "Use emojis" - Modern icons like 📂 and 📄
   - "Use symbols" - Alternative symbols like 🗁 and 🗎

## 🛠️ Project Structure

```text
📂treemaker/
├── 📂img/
│   └── 📄icon.png              # Extension icon
├── 📄popup.html                # Main interface
├── 📄popup.js                  # Interface logic
├── 📄background.js             # Background script
├── 📄styles.css                # Interface styles
├── 📄manifest.json             # Extension configuration
└── 📄README.md                 # This file
```

*Yes, this structure was created using TreeMaker!* 🤑

## 🎨 Customization Options

TreeMaker offers several customization features:

### Visual Customization

- Switch between emoji and symbol representations for folder and document icons
- Clean, minimal interface that focuses on functionality
- Responsive design that works at various popup sizes

### Functional Customization

- Three operation modes tailored to different workflows
- Smart text insertion that detects active input fields
- Visual feedback when content is copied

## 🔮 Future Enhancements

Planned features for upcoming versions:

- Expanded symbol library
- Customizable grid layouts
- Color/dark themes
- Customizable keyboard shortcuts
- Usage history of recently used symbols
- Settings synchronization across devices

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Reporting Issues

If you encounter any problems or have suggestions:

1. Check if the issue has already been reported
2. If not, create a new issue with a detailed description
3. Include information about your browser and OS version

---

**TreeMaker** - Create diagrams and structures easily 🚀

Enjoying TreeMaker? Please star ⭐ our GitHub repository and share it with others!
