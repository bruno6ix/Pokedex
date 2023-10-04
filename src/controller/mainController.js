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
                    imageUrl: imageUrl,
                    id: id
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
                res.redirect('/pokemon/list');
            } else {
                const text = await response.text(); 
            
                try {
                    const pokemon = JSON.parse(text);
                    res.render('pokeDetailSearch.ejs', { pokemon });
                } catch (jsonError) {
                    console.error(jsonError);
                    res.redirect('/pokemon/list');
                }
            }
        } catch (error) {
            console.error(error);
            res.redirect('/pokemon/list');
        }
    },

    'detail': async (req, res) => {
        try {
            const { id } = req.params;
            const response = await fetch(`${API}/${id.toLowerCase()}`);
            
            if (!response.ok) {
                throw new Error(`Error al obtener el detalle del Pokémon: ${response.statusText}`);
            }

            const pokemon = await response.json();
            const pokemonId = pokemon.id;
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            const types = pokemon.types.map((typesObj) => typesObj.type.name)
            const abilities = pokemon.abilities.map((abilityObj) => abilityObj.ability.name);
            const moves = pokemon.moves.map((movesObj) => movesObj.move.name);
            const stats = pokemon.stats.map((statsObj) => [statsObj.stat.name + ' ' + statsObj.base_stat]);
            

            const pokemonDetail = {
                name: pokemon.name,
                height: pokemon.height,
                weight: pokemon.weight,
                types: types,
                ability: abilities,
                moves: moves,
                stats: stats,
                imageUrl: imageUrl,
                id: pokemonId
            };

            console.log(pokemonDetail)

            res.render('pokeDetail.ejs', { result: pokemonDetail });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener el detalle del Pokémon');
        }
    }
}

module.exports = mainController;
