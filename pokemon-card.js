// Initialize the Lottie animation (don’t autoplay)
  const loaderContainer = document.getElementById('lottieLoader');
  const loaderAnim = lottie.loadAnimation({
    container: loaderContainer,
    renderer: 'svg',
    loop: true,
    autoplay: false,
    // Use the path where you added the JSON file:
    path: 'assets/lottie/pokemon-loading.json'
    // If you’re bundling, you can use `animationData: <imported JSON>` instead of `path`.
  });

  function showLoader() {
    loaderContainer.style.display = 'block';
    loaderAnim.goToAndPlay(0, true);
  }

  function hideLoader() {
    loaderAnim.pause();
    loaderContainer.style.display = 'none';
  }

  async function getRandomPokemonCard() {
    const btn = document.getElementById('loadCardBtn');
    const container = document.getElementById('cardContainer');

    // Guard: make sure container exists
    if (!container) {
      console.error('#cardContainer not found');
      return;
    }

    // Optional: disable button while loading
    if (btn) btn.disabled = true;
    showLoader();
    container.innerHTML = ''; // clear previous result

    try {
      // ——— Your existing random page approach ———
      const pageSize = 1;
      const approxTotal = 30000;
      const maxPage = Math.max(1, Math.floor(approxTotal / pageSize));
      const randomPage = 1 + Math.floor(Math.random() * maxPage);

      const resp = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${randomPage}`);
      const data = await resp.json();

      // Handle empty results gracefully
      if (!data?.data?.length) {
        container.textContent = 'No card found. Try again!';
        return;
      }

      const card = data.data[0];

      container.innerHTML = `
        <h2 style="text-align:center">${card.name ?? 'Unknown Card'}</h2>
        <img src="${card.images?.large || card.images?.small || ''}" alt="${card.name ?? 'Pokémon'}" />
      `;
    } catch (err) {
      console.error('Error fetching card:', err);
      container.textContent = 'There was a problem loading a card. Please try again.';
    } finally {
      hideLoader();
      if (btn) btn.disabled = false;
    }
  }

  // Hook up the button
  document.getElementById('loadCardBtn').addEventListener('click', getRandomPokemonCard);