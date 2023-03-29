import './App.css';
import axios from 'axios';
import Container from './components/Container';
import Picture from './components/Picture';
import Stats from './components/Stats';
import Details from './components/Details';
import Evolution from './components/Evolution';
import { useEffect, useState } from 'react';
import { SpinnerCircular } from 'spinners-react';

function App() {
	const [pokemonID, setPokemonID] = useState(4);
	const [pokemonData, setPokemonData] = useState(null);
	const [pokeEvolution, setPokeEvolution] = useState(null);
	const [pokeWeakness, setPokeWeakness] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const fetchPokemonData = async () => {
		try {
			if (!isLoading) {
				setIsLoading(true);
			}
			const pokemonDetailsResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
			console.log(pokemonDetailsResp);
			setPokemonData(pokemonDetailsResp.data);
			const pokemonSpeciesResp = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`);

			//Pokemon Type Weakness Get Request
			const pokemonTypeResp = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonID}`);
			setPokeWeakness(pokemonTypeResp.data.damage_relations.double_damage_from);

			// Evolution Get Request
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
		} finally {
			setIsLoading(false);
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
			{isLoading ? (
				<SpinnerCircular enabled={isLoading} />
			) : (
				<>
					<h1>{pokemonData.name}</h1>
					<div className='master-container'>
						<button className='change-pokemon-btn' onClick={() => handlePokemonIDChange('-')}>
							{'<'}
						</button>
						{pokemonData && pokeEvolution && pokeWeakness && (
							<Container>
								<div className='picture detail-box'>
									<Picture sprite={pokemonData.sprites.front_default} />
								</div>
								<div className='stats detail-box'>
									<Stats stats={pokemonData.stats} />
								</div>
								<div className='details detail-box'>
									<Details name={pokemonData.name} types={pokemonData.types} weaknesses={pokeWeakness} />
								</div>
								<div className='evolution detail-box'>
									<Evolution evolution={pokeEvolution} />
								</div>
							</Container>
						)}

						<button className='change-pokemon-btn' onClick={() => handlePokemonIDChange('+')}>
							{'>'}
						</button>
					</div>
				</>
			)}
		</div>
	);
}

export default App;
