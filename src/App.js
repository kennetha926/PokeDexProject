import './App.css';
import axios from 'axios';
import Container from './components/Container';
import Picture from './components/Picture';
import Stats from './components/Stats';
import Details from './components/Details';
import Evolution from './components/Evolution';
import { useEffect, useState } from 'react';

function App() {
	const [pokemonID, setPokemonID] = useState(1);
	const [pokemonData, setPokemonData] = useState(null);
	const [pokeEvolution, setPokeEvolution] = useState(null);
	const fetchPokemonData = async () => {
		try {
			const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
			setPokemonData(resp.data);
			console.log(resp);
		} catch (error) {
			alert('Not found!');
		}
	};

	const fetchPokeEvolution = async () => {
		try {
			const response = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${pokemonID}`);
			setPokeEvolution(response.data);
		} catch (error) {
			alert('Evolution data not found!');
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
			await fetchPokeEvolution();
		})();
	}, [pokemonID]);

	return (
		<div className='App'>
			<div className='Title'>PokeDex Project</div>
			{pokemonData && pokeEvolution && (
				<Container>
					<Details name={pokemonData.name} types={pokemonData.types} />
					<Picture sprite={pokemonData.sprites.front_default} />
					<Stats stats={pokemonData.stats} />
					<Evolution evolution={pokeEvolution} original={{ sprite: pokemonData.sprites.front_default, name: pokemonData.name }} />
					<button onClick={() => handlePokemonIDChange('-')}> {'<'} </button>
					<button onClick={() => handlePokemonIDChange('+')}> {'>'} </button>
				</Container>
			)}
		</div>
	);
}

export default App;
