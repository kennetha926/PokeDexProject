import './App.css';
import axios from 'axios';
import Container from './components/Container';
import Picture from './components/Picture';
import Stats from './components/Stats';
import Details from './components/Details';
import Evolution from './components/Evolution';
import { useEffect, useState } from 'react';

function App() {
	const [pokemonID, setPokemonID] = useState(4);
	const [pokemonData, setPokemonData] = useState(null);
	const [pokeEvolution, setPokeEvolution] = useState(null);
	const fetchPokemonData = async () => {
		try {
			const pokemonDetailsResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
			console.log(pokemonDetailsResp);
			setPokemonData(pokemonDetailsResp.data);
			const pokemonSpeciesResp = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`);
			const pokemonEvolutionChainResp = await axios.get(pokemonSpeciesResp.data.evolution_chain.url);
			// No evolution
			if (pokemonEvolutionChainResp.data.chain.evolves_to.length === 0) {
				setPokeEvolution([{ name: pokemonDetailsResp.data.name, sprite: pokemonDetailsResp.data.sprites.front_default }]);
			}

			// Only one evolution
			if (pokemonEvolutionChainResp.data.chain.evolves_to.length > 0 && pokemonEvolutionChainResp.data.chain.evolves_to[0].evolves_to.length === 0) {
				const firstEvolutionResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChainResp.data.chain.species.name}`);
				const secondEvolutionResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChainResp.data.chain.evolves_to[0].species.name}`);
				setPokeEvolution([
					{ name: firstEvolutionResp.data.name, sprite: firstEvolutionResp.data.sprites.front_default },
					{ name: secondEvolutionResp.data.name, sprite: secondEvolutionResp.data.sprites.front_default }
				]);
			}

			// Two evolutions
			if (pokemonEvolutionChainResp.data.chain.evolves_to.length > 0 && pokemonEvolutionChainResp.data.chain.evolves_to[0].evolves_to.length > 0) {
				const firstEvolutionResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChainResp.data.chain.species.name}`);
				const secondEvolutionResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChainResp.data.chain.evolves_to[0].species.name}`);
				const thirdEvolutionResp = await axios.get(
					`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChainResp.data.chain.evolves_to[0].evolves_to[0].species.name}`
				);
				setPokeEvolution([
					{ name: firstEvolutionResp.data.name, sprite: firstEvolutionResp.data.sprites.front_default },
					{ name: secondEvolutionResp.data.name, sprite: secondEvolutionResp.data.sprites.front_default },
					{ name: thirdEvolutionResp.data.name, sprite: thirdEvolutionResp.data.sprites.front_default }
				]);
			}
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
			{pokemonData && pokeEvolution && (
				<Container>
					<div className='picture detail-box'>
						<Picture sprite={pokemonData.sprites.front_default} />
					</div>
					<div className='stats detail-box'>
						<Stats stats={pokemonData.stats} />
					</div>
					<div className='details detail-box'>
						<Details name={pokemonData.name} types={pokemonData.types} />
					</div>
					<div className='evolution detail-box'>
						<Evolution evolution={pokeEvolution} />
					</div>
					{/* <button onClick={() => handlePokemonIDChange('-')}> {'<'} </button>
					<button onClick={() => handlePokemonIDChange('+')}> {'>'} </button> */}
				</Container>
			)}
		</div>
	);
}

export default App;
