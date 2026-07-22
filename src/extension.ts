import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let panel: vscode.WebviewPanel | undefined;
const log = vscode.window.createOutputChannel('Claude Plan Viewer');

export function activate(context: vscode.ExtensionContext) {
  const root = vscode.workspace.workspaceFolders?.[0];
  if (!root) { return; }

  const planPath = path.join(root.uri.fsPath, '.claude', 'plan.json');

  const open = () => showPanel(context, planPath);

  // Manual command
  context.subscriptions.push(
    vscode.commands.registerCommand('claudePlanViewer.open', open)
  );

  // Auto-open on change/create
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(root, '.claude/plan.json')
  );
  watcher.onDidChange(open);
  watcher.onDidCreate(open);
  context.subscriptions.push(watcher);

  // If a plan already exists at startup, open it
  if (fs.existsSync(planPath)) { open(); }
}

function loadPlan(planPath: string): any | undefined {
  try {
    return JSON.parse(fs.readFileSync(planPath, 'utf8'));
  } catch (e) {
    log.appendLine(`Failed to parse plan.json: ${e}`);
    return undefined;
  }
}

function showPanel(context: vscode.ExtensionContext, planPath: string) {
  const plan = loadPlan(planPath);
  if (!plan) { return; }

  if (!panel) {
    panel = vscode.window.createWebviewPanel(
      'claudePlanViewer',
      'Plan',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
      }
    );
    panel.onDidDispose(() => { panel = undefined; });

    // Button clicks write the approval file that Claude Code's hook is polling for
    const approvalPath = path.join(path.dirname(planPath), 'plan-approval.json');
    panel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.action !== 'approved' && msg.action !== 'changes_requested') { return; }

      let feedback = '';
      if (msg.action === 'changes_requested') {
        feedback = await vscode.window.showInputBox({
          prompt: 'What should change in the plan?',
          placeHolder: 'e.g. skip step 3, use the shared/fhir layer instead'
        }) ?? '';
      }

      fs.writeFileSync(approvalPath, JSON.stringify({
        status: msg.action,
        feedback,
        plan_summary: msg.text ?? '',
        timestamp: new Date().toISOString()
      }, null, 2));

      log.appendLine(`[${new Date().toISOString()}] ${msg.action}: ${feedback || msg.text || ''}`);
      panel?.webview.postMessage({ type: 'ack', status: msg.action });
      vscode.window.showInformationMessage(
        msg.action === 'approved' ? 'Plan approved — Claude is proceeding.' : 'Changes requested — Claude will revise the plan.'
      );
    });
  }

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'media', 'viewer.js')
  );
  panel.title = plan.summary ? plan.summary.slice(0, 40) : 'Plan';
  panel.webview.html = html(scriptUri, plan);
  panel.reveal(vscode.ViewColumn.Beside, true);
}

function html(scriptUri: vscode.Uri, plan: any): string {
  const data = JSON.stringify(plan).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground);
         padding: 16px; font-size: 13px; }
  code { font-family: var(--vscode-editor-font-family); }
  .banner { background: var(--vscode-textBlockQuote-background);
            border-left: 3px solid var(--vscode-textLink-foreground);
            padding: 10px 14px; margin-bottom: 16px; }
  .row { display:flex; align-items:center; gap:10px; padding:7px 10px;
         background: var(--vscode-list-hoverBackground); border-radius:5px; margin-bottom:5px; }
  .tag { font-size:11px; padding:2px 8px; border-radius:4px; min-width:52px;
         text-align:center; text-transform:uppercase; }
  .create { background:#294436; color:#89d185; }
  .modify { background:#4a3f1e; color:#e2c08d; }
  .delete { background:#4a2727; color:#f48771; }
  .step { display:flex; gap:10px; padding:9px 11px; cursor:pointer;
          border:1px solid var(--vscode-widget-border); border-radius:5px; margin-bottom:6px; }
  .chk { width:16px; height:16px; border:1.5px solid var(--vscode-foreground);
         border-radius:4px; flex-shrink:0; }
  .chk.on { background: var(--vscode-textLink-foreground);
            border-color: var(--vscode-textLink-foreground); }
  .risk { padding:7px 10px; background:#4a3f1e; color:#e2c08d;
          border-radius:5px; margin-bottom:5px; }
  h3 { font-size:12px; text-transform:uppercase; opacity:.7; margin:16px 0 6px; }
  button { background: var(--vscode-button-background);
           color: var(--vscode-button-foreground); border:none;
           padding:8px 14px; border-radius:5px; cursor:pointer; margin-right:8px; }
  button.secondary { background: var(--vscode-button-secondaryBackground);
                     color: var(--vscode-button-secondaryForeground); }
  button:disabled { opacity:.5; cursor:default; }
  del { opacity:.5; }
</style></head>
<body>
  <div id="app"></div>
  <script>window.__PLAN__ = ${data};</script>
  <script src="${scriptUri}"></script>
</body></html>`;
}

export function deactivate() {}