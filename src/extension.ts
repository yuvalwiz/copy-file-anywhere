import * as vscode from 'vscode';
import { randomBytes } from 'crypto';

function uniqueMarker(text: string): string {
  // Generate a marker that is guaranteed not to clash with the file’s content
  let token: string;
  do {
    token = 'EOF' + randomBytes(8).toString('hex').toUpperCase(); // e.g. EOF9A27DB3F9A47D63F
  } while (text.includes(token));
  return token;
}

function wrap(text: string, targetPath: string): string {
  const marker = uniqueMarker(text);
  return `cat <<'${marker}' > '${targetPath}'\n${text}\n${marker}\nchmod +x '${targetPath}'\n`;
}

function wrapBase64(text: string, targetPath: string): string {
  const base64Content = Buffer.from(text, 'utf8').toString('base64');
  return `echo '${base64Content}' | base64 -d > '${targetPath}' ; chmod +x '${targetPath}'`;
}

async function copyToClipboard(payload: string, label: string, method: string = 'Heredoc') {
  await vscode.env.clipboard.writeText(payload);
  vscode.window.showInformationMessage(`${method} for "${label}" copied to clipboard`);
}

export function activate(context: vscode.ExtensionContext) {
  // Command 1 – hard‑coded path "script"
  context.subscriptions.push(
    vscode.commands.registerCommand('copyfileanywhere.heredoc', async () => {
      const ed = vscode.window.activeTextEditor;
      if (!ed) { return; }
      await copyToClipboard(wrap(ed.document.getText(), 'script'), 'script');
    })
  );

  // Command 2 – prompt for any path
  context.subscriptions.push(
    vscode.commands.registerCommand('copyfileanywhere.heredocCustom', async () => {
      const ed = vscode.window.activeTextEditor;
      if (!ed) { return; }
      const path = await vscode.window.showInputBox({
        prompt: 'Output path for heredoc',
        placeHolder: 'e.g. ./bin/myscript',
        value: 'script'
      });
      if (path) {
        await copyToClipboard(wrap(ed.document.getText(), path), path);
      }
    })
  );

  // Command 3 – base64 hard‑coded path "script"
  context.subscriptions.push(
    vscode.commands.registerCommand('copyfileanywhere.base64', async () => {
      const ed = vscode.window.activeTextEditor;
      if (!ed) { return; }
      await copyToClipboard(wrapBase64(ed.document.getText(), 'script'), 'script', 'Base64');
    })
  );

  // Command 4 – base64 prompt for any path
  context.subscriptions.push(
    vscode.commands.registerCommand('copyfileanywhere.base64Custom', async () => {
      const ed = vscode.window.activeTextEditor;
      if (!ed) { return; }
      const path = await vscode.window.showInputBox({
        prompt: 'Output path for base64 transfer',
        placeHolder: 'e.g. ./bin/myscript',
        value: 'script'
      });
      if (path) {
        await copyToClipboard(wrapBase64(ed.document.getText(), path), path, 'Base64');
      }
    })
  );
}

export function deactivate() { /* noop */ }