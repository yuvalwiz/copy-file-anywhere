# Copy File Anywhere

A VS Code extension that lets you copy files to another system. Places a command in your clipboard the will create the file upon being pasted to a shell.

## Features

This extension provides four commands to copy files for terminal recreation:

**Heredoc Method:**
Uses a Heredoc, great for smaller text files. **Note**: will append a newline.
- **Heredoc: wrap current file → script** - Generates a command that'll copy to a file named `script`.
- **Heredoc: wrap current file → custom path** - Prompts you for a custom output path.

**Base64 Method:**
Uses base64, target shell must have the `base64` tool installed.
- **Base64: copy current file → script**
- **Base64: copy current file → custom path**

### How it works
The extensin copies to following to your clipboard.

**Heredoc Method** (good for text files):
```bash
cat <<'EOF{RANDOM-8-BYTES}' > 'script'
#!/bin/bash
echo "Hello World"
EOF<{RANDOM-8-BYTES}
chmod +x 'script'
```

**Base64 Method** (good for any file, including binary):
```bash
echo '{FILE-BASE64-ENCODED}' | base64 -d > 'script' ; chmod +x 'script'
```

## Usage

1. Open any file in VS Code
2. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
3. Run one of these commands:
   - `Heredoc: wrap current file → script`
   - `Heredoc: wrap current file → custom path`
   - `Base64: copy current file → script`
   - `Base64: copy current file → custom path` 
4. The transfer command is copied to your clipboard
5. Paste it in to the target terminal.

## Requirements

No additional requirements or dependencies.

## Release Notes

### 0.0.1

Initial release of Copy File Anywhere extension.

