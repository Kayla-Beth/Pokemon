// Initialize the Lottie animation (don’t autoplay)
const loaderContainer = document.getElementById('lottieLoader');
const loaderAnim = lottie.loadAnimation({
  container: loaderContainer,
  renderer: 'svg',
  loop: true,
  autoplay: false,
  path: 'assets/lottie/pokemon-loading.json'
});

function showLoader() {
  loaderContainer.style.display = 'block';
  loaderAnim.goToAndPlay(0, true);
}

function hideLoader() {
  loaderAnim.pause();
  loaderContainer.style.display = 'none';
}

// ---------- RENDER ----------
function renderCard(card) {
  const target = document.getElementById('searchResult');
  if (!target) return;

  if (!card) {
    target.className = 'result-card empty';
    target.innerHTML = '<p>No results. Try a different search.</p>';
    return;
  }

  const name = card.name || 'Unknown';
  const supertype = card.supertype || '';
  const subtypes = (card.subtypes || []).join(' • ');
  const types = card.types || [];
  const hp = card.hp || '—';
  const rarity = card.rarity || '—';
  const setName = card.set?.name || '—';
  const number = card.number || '—';
  const image = card.images?.large || card.images?.small || '';
  const artist = card.artist || '';
  const flavor  = card.flavorText || '';

  const typeChips = types.map(t => {
    const cls = `type-${t.toLowerCase()}`;
    return `<span class="chip type-chip ${cls}">${t}</span>`;
  }).join('');

  target.className = 'result-card';
  target.innerHTML = `
    <img class="card-art" src="${image}" alt="${name} card art" loading="lazy" />
    <div class="card-meta">
      <div class="card-title">
        <h2>${name}</h2>
        <span class="subtle">${supertype}${subtypes ? ` — ${subtypes}` : ''}</span>
      </div>

      <div class="chips">
        ${typeChips || '<span class="chip">No Type</span>'}
      </div>

      <div class="info-grid">
        <div class="info-item"><span class="info-label">HP</span><span>${hp}</span></div>
        <div class="info-item"><span class="info-label">Rarity</span><span>${rarity}</span></div>
        <div class="info-item"><span class="info-label">Set</span><span>${setName}</span></div>
        <div class="info-item"><span class="info-label">Number</span><span>${number}</span></div>
        ${artist ? `<div class="info-item"><span class="info-label">Artist</span><span>${artist}</span></div>` : ''}
      </div>

      ${flavor ? `<p class="subtle" style="margin-top:8px;">${flavor}</p>` : ''}

      <div class="card-actions">
        <button class="btn-ghost" id="viewFullBtn">View Full Image</button>
        <button class="btn-ghost" id="copyLinkBtn">Copy Link</button>
      </div>
    </div>
  `;

  document.getElementById('viewFullBtn')?.addEventListener('click', () => {
    if (image) window.open(image, '_blank');
  });

  document.getElementById('copyLinkBtn')?.addEventListener('click', async () => {
    try {
      const url = `https://pokemontcg.io/card/${encodeURIComponent(card.id)}`;
      await navigator.clipboard.writeText(url);
      alert('Card link copied!');
    } catch {
      alert('Could not copy link.');
    }
  });
}

// ---------- RANDOM ----------
async function getRandomPokemonCard() {
  const btn = document.getElementById('loadCardBtn');
  const target = document.getElementById('searchResult');
  if (!target) {
    console.error('#searchResult not found');
    return;
  }

  if (btn) btn.disabled = true;
  target.className = 'result-card';
  target.innerHTML = '';
  showLoader();

  try {
    const pageSize = 1;
    const approxTotal = 30000;
    const maxPage = Math.max(1, Math.floor(approxTotal / pageSize));
    const randomPage = 1 + Math.floor(Math.random() * maxPage);

    const resp = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${randomPage}`);
    const data = await resp.json();

    const card = data?.data?.[0] || null;
    if (!card) {
      target.className = 'result-card empty';
      target.innerHTML = '<p>No card found. Try again!</p>';
      return;
    }
    renderCard(card);
  } catch (err) {
    console.error('Error fetching card:', err);
    target.className = 'result-card error';
    target.innerHTML = '<p>There was a problem loading a card. Please try again.</p>';
  } finally {
    hideLoader();
    if (btn) btn.disabled = false;
  }
}

// ---------- SEARCH ----------
async function searchByName(name) {
  const target = document.getElementById('searchResult');
  if (!target) return;

  target.className = 'result-card';
  target.innerHTML = '';
  showLoader();

  try {
    const resp = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(name)}&pageSize=1`);
    const data = await resp.json();
    const card = data?.data?.[0] || null;
    console.log("KB");
    console.log(data);
    renderCard(card);
  } catch (e) {
    target.className = 'result-card error';
    target.innerHTML = '<p>Something went wrong. Please try again.</p>';
  } finally {
    hideLoader();
  }
}

// ---------- EVENTS ----------
document.getElementById('loadCardBtn')?.addEventListener('click', getRandomPokemonCard);

document.getElementById('searchBtn')?.addEventListener('click', () => {
  const val = document.getElementById('searchInput')?.value?.trim();
  if (val) searchByName(val);
});

document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = e.currentTarget.value.trim();
    if (val) searchByName(val);
  }
});

(() => {
  // Prevent duplicate init if script loads twice
  if (window.__POKEDEX_BULBA_INIT__) return;
  window.__POKEDEX_BULBA_INIT__ = true;

  const bulbaEl = document.getElementById('bulbaLottie');
  if (!bulbaEl) return;

  // Respect user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Load the Bulbasaur lottie ---

  const bulbaPath = 'assets/lottie/001-Bulbasaur.json';


  const bulbaAnim = lottie.loadAnimation({
    container: bulbaEl,
    renderer: 'svg',
    loop: true,        // keep the run cycle looping
    autoplay: true,    // starts running
    path: bulbaPath
  });

  // Start/stop the horizontal “run across” motion separately from the lottie frame loop
  function startRun() {
    bulbaEl.classList.add('is-running');
  }
  function stopRun() {
    bulbaEl.classList.remove('is-running');
  }

  // Only animate across if not reduced motion
  if (!prefersReduced) startRun();

  // Pause the across-motion when tab isn’t visible to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      stopRun();
      bulbaAnim.pause();
    } else {
      if (!prefersReduced) startRun();
      bulbaAnim.play();
    }
  });

  // Optional: pause on hover (fun detail)
  bulbaEl.addEventListener('mouseenter', () => {
    stopRun();
    bulbaAnim.pause();
  });
  bulbaEl.addEventListener('mouseleave', () => {
    if (!prefersReduced) startRun();
    bulbaAnim.play();
  });
})();