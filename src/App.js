import './App.css';
import axios from 'axios';
import Container from './components/Container';
import Picture from './components/Picture';
import Stats from './components/Stats';
import Details from './components/Details';
import Evolution from './components/Evolution';
import { useEffect, useState } from 'react';

function App() {
	const [pokemonID, setPokemonID] = useState(7);
	const [pokemonData, setPokemonData] = useState(null);
	const [pokeEvolution, setPokeEvolution] = useState(null);
	const fetchPokemonData = async () => {
		try {
			const pokemonDetailsResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
			console.log(pokemonDetailsResp);
			setPokemonData(pokemonDetailsResp.data);
			const pokemonSpeciesResp = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`);
			const pokemonEvolutionChainResp = await axios.get(pokemonSpeciesResp.data.evolution_chain.url);

			if (pokemonEvolutionChainResp.data.chain.evolves_to.length === 0) {
				setPokeEvolution([{ name: pokemonDetailsResp.data.name, sprite: pokemonDetailsResp.data.sprites.front_default }]);
			}
			// if (pokemonEvolutionChainResp.data.chain.evolves_to.length > 0) {
			// 	setPokeEvolution([{name: pokemonDetailsResp.data.name, sprite: pokemonDetailsResp.data.sprites.front_default },
			//   { name: pokemonEvolutionChainResp.data.chain.evolves_to[0].species.name,
			//   :
			//   }
			//   ]);
			// }
		} catch (error) {
			alert('Not found!');
		}
	};

	const handlePokemonIDChange = (sign) => {
		if (sign === '-') {
			setPokemonID(pokemonID - 1);
		}
		if (sign === '+') {
			setPokemonID(pokemonID + 1);
		}
	};

	useEffect(() => {
		(async () => {
			await fetchPokemonData();
		})();
	}, [pokemonID]);

	return (
		<div className='App'>
			<div className='Title'>PokeDex Project</div>
			{pokemonData && (
				<Container>
					<Details name={pokemonData.name} types={pokemonData.types} />
					<Picture sprite={pokemonData.sprites.front_default} />
					<Stats stats={pokemonData.stats} />
					{/* <Evolution evolution={pokeEvolution} original={{ sprite: pokemonData.sprites.front_default, name: pokemonData.name }} /> */}
					<button onClick={() => handlePokemonIDChange('-')}> {'<'} </button>
					<button onClick={() => handlePokemonIDChange('+')}> {'>'} </button>
				</Container>
			)}
		</div>
	);
}

export default App;
