const API = 'https://pokeapi.co/api/v2/pokemon';

const mainController = {
    'index': async (req, res) => {
        try {
            const response = await fetch(API);
            const pokemonList = await response.json();
            const pokemonImg = pokemonList.results.map((pokemon) => {
                const id = pokemon.url.split('/').slice(-2, -1);
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                return {
                    name: pokemon.name,
                    imageUrl: imageUrl
                };
            });

            res.render('index', { pokemonList: pokemonImg });
        } catch (error) {
            console.error(error);
        }
    },

    'buscar': async (req, res) => {
        try {
            const response = await fetch(`${API}/${req.body.titulo.toLowerCase()}`);
            
            if (response.status === 404) {
                res.redirect('/');
            } else {
                const text = await response.text(); 
            
                try {

                    const pokemon = JSON.parse(text);
                    res.render('pokeDetail.ejs', { pokemon });
                } catch (jsonError) {
                    console.error(jsonError);
                    res.redirect('/');
                }
            }
        } catch (error) {
            console.error(error);
            res.redirect('/');
        }
    }
};

module.exports = mainController;
