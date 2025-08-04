let db = [];

async function load() {
  const res = await fetch('data.json');
  db = await res.json();
  render(db.slice(0, 6));
}

function render(items) {
  const root = document.getElementById('results');
  root.innerHTML = '';
  for (const it of items) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<h3 class="clickable">${it.title}</h3>
      <div class="badges">${(it.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}</div>
      <div class="preview">${it.answer}</div>
      <div class="details" style="display:none;">
        <p><strong>Manual section:</strong> ${it.section} · Pages: ${it.pages||'—'}</p>
        <p>${it.answer}</p>
      </div>`;
    el.querySelector('h3').addEventListener('click', () => {
      const d = el.querySelector('.details');
      d.style.display = d.style.display === 'none' ? 'block' : 'none';
    });
    root.appendChild(el);
  }
}

function search(q) {
  q = q.trim().toLowerCase();
  if (!q) return render(db.slice(0, 6));
  const words = q.split(/\s+/);
  const items = db.filter(it => {
    const hay = (it.title + ' ' + (it.answer||'') + ' ' + (it.tags||[]).join(' ')).toLowerCase();
    return words.every(w => hay.includes(w));
  });
  render(items.slice(0, 20));
}

window.addEventListener('load', () => {
  load();
  const input = document.getElementById('q');
  input.addEventListener('input', (e)=> search(e.target.value));

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('installBtn');
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      btn.hidden = true;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
    });
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
});
