const API = 'https://pokeapi.co/api/v2/pokemon?limit=1200&offset=0';

const mainController = {
    'index': async (req, res) => {
        try {
            const response = await fetch(API);
            const pokemonList = await response.json();
            const pokemonWithImages = pokemonList.results.map((pokemon) => {
                const id = pokemon.url.split('/').slice(-2, -1);
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                return {
                    name: pokemon.name,
                    imageUrl: imageUrl
                };
            });

            res.render('index', { pokemonList: pokemonWithImages });
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports = mainController;
