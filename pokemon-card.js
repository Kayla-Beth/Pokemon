async function getRandomPokemonCard() {
      const pageSize = 1;
      const totalCards = 30000; // approximate number of cards
      const maxPage = Math.floor(totalCards / pageSize);
      const randomPage = Math.floor(Math.random() * maxPage) + 1;

      const response = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${randomPage}`);
      const data = await response.json();

      const card = data.data[0];
      console.log('Random card:', card.name, card.images.large);

      const container = document.getElementById('cardContainer');
      container.innerHTML = `<h2>${card.name}</h2><img src="${card.images.small}" alt="${card.name}" />`;
    }

    document.getElementById('loadCardBtn').addEventListener('click', getRandomPokemonCard);

getRandomPokemonCard();
