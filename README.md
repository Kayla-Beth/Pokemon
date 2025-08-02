# Pokemon

This is my Javascript project. Hosted at https://kayla-beth.github.io/Pokemon/ It uses the Pokemon TCG API (https://docs.pokemontcg.io/) to fetch either a random card or searches for a specific card. Then shows the card and the related data from the card object. I commented out some other HTML that was eventually going to be a virtual binder that you could add cards to from the search/random, but ran out of time. 

Known bugs:
1. Random card will sometimes time out. I haven't fully debugged but I think that the math.floor calculations might be a bit slow. I think i would refactor to have a variable between 1 & 3000, and just put that variable inside the fetch to see if that speeds up the call. 
2. The API searches for a pokemon in an alphebetical search. So searching for a pokemon like `Sandshrew`, the API will return the card `Dark Sandshrew` because that cards shows up first in an alphebetical search. I would change the request to send the exact match of the name instead of just grabbing the first one with something like `"${name}"`. 
