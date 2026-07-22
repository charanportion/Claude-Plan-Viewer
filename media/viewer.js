const vscode = acquireVsCodeApi();
const p = window.__PLAN__;
const el = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; };
const esc = (s) => String(s).replace(/</g, '&lt;');

const app = document.getElementById('app');
let done = 0;

app.appendChild(el(`<h2 style="font-size:15px;margin:0 0 4px;">${esc(p.summary || 'Plan')}</h2>`));

if (p.files?.length) {
  app.appendChild(el(`<h3>Files touched</h3>`));
  p.files.forEach(f => app.appendChild(el(
    `<div class="row"><span class="tag ${f.action}">${esc(f.action)}</span>
     <code style="flex:1">${esc(f.path)}</code>
     <span style="opacity:.6">${esc(f.why || '')}</span></div>`)));
}

if (p.steps?.length) {
  app.appendChild(el(`<h3>Steps</h3><span id="prog" style="opacity:.6">0 / ${p.steps.length} done</span>`));
  p.steps.forEach((s, i) => {
    const row = el(`<div class="step"><span class="chk"></span>
      <div style="flex:1"><span class="lbl">${i + 1}. ${esc(s.title)}</span>
      <div><code style="font-size:11px;opacity:.6">${esc(s.file || '')}</code></div></div></div>`);
    row.onclick = () => {
      const chk = row.querySelector('.chk'), lbl = row.querySelector('.lbl');
      const on = chk.classList.toggle('on');
      lbl.innerHTML = on ? `<del>${lbl.textContent}</del>` : lbl.textContent;
      done += on ? 1 : -1;
      document.getElementById('prog').textContent = `${done} / ${p.steps.length} done`;
    };
    app.appendChild(row);
  });
}

if (p.risks?.length) {
  app.appendChild(el(`<h3>Risks & assumptions</h3>`));
  p.risks.forEach(r => app.appendChild(el(`<div class="risk">${esc(r)}</div>`)));
}

if (p.out_of_scope?.length) {
  app.appendChild(el(`<h3>Out of scope</h3>`));
  p.out_of_scope.forEach(o => app.appendChild(el(`<div class="risk">${esc(o)}</div>`)));
}

const bar = el(`<div style="margin-top:18px">
  <button id="ok">Approve &amp; build</button>
  <button id="rev" class="secondary">Request changes</button>
  <span id="status" style="margin-left:6px;opacity:.7"></span></div>`);
bar.querySelector('#ok').onclick = () => vscode.postMessage({ action: 'approved', text: p.summary });
bar.querySelector('#rev').onclick = () => vscode.postMessage({ action: 'changes_requested', text: p.summary });
app.appendChild(bar);

window.addEventListener('message', (e) => {
  if (e.data?.type !== 'ack') return;
  bar.querySelectorAll('button').forEach(b => b.disabled = true);
  bar.querySelector('#status').textContent =
    e.data.status === 'approved' ? '✓ Approved — Claude is building' : '✗ Changes requested — Claude is revising';
});