const { parse } = require("path");

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
    
            const [pokemonRes, speciesRes] = await Promise.all([
                fetch(`${API}/${id.toLowerCase()}`),
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${id.toLowerCase()}`)
            ]);
    
            if (!pokemonRes.ok || !speciesRes.ok) {
                res.redirect('/pokemon/list')
            }
    
            const [pokemonData, speciesData] = await Promise.all([
                pokemonRes.json(),
                speciesRes.json()
            ]);
    
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;
            const types = pokemonData.types.map(({ type }) => type.name);
            const abilities = pokemonData.abilities.map(({ ability }) => ability.name);
            const moves = pokemonData.moves.map(({ move }) => move.name);
            const stats = pokemonData.stats.map(({ stat, base_stat }) => `${stat.name} ${base_stat}`);
            const lang = "es";
            const desc = speciesData.flavor_text_entries.find((entry) => entry.language.name === lang)?.flavor_text || '';
    
            const infoChainRes = await fetch(speciesData.evolution_chain.url);
            if (!infoChainRes.ok) {
                res.redirect('/pokemon/list')
            }
            const infoEvo = await infoChainRes.json();
    
            const extraerEvo = (chain) => {
                const speciesName = chain.species.name;
                const evolvesTo = chain.evolves_to.map(extraerEvo);
                return [speciesName, ...evolvesTo];
            };
    
            const evolutionDetails = extraerEvo(infoEvo.chain);
    
            const pokemonDetail = {
                name: pokemonData.name,
                desc: desc,
                height: pokemonData.height,
                weight: pokemonData.weight,
                types: types,
                ability: abilities,
                moves: moves,
                stats: stats,
                imageUrl: imageUrl,
                id: pokemonData.id,
                evolution: evolutionDetails,
            };
    
            res.render('pokeDetail.ejs', { result: pokemonDetail });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener el detalle del Pokémon');
        }
    }    

}

module.exports = mainController;
