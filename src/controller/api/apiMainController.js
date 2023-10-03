const API = 'https://pokeapi.co/api/v2/pokemon/ditto';

const apiMainController = {
    'index': (req, res) => {
        fetch(API)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la API no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'Error al obtener datos de la API' });
            });
    }
};

module.exports = apiMainController;
