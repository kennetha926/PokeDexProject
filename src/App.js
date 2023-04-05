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
			const weaknesses = [];
			const firstPokemonTypeResp = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonDetailsResp.data.types[0].type.name}`);
			// [{name: 'fire', url: ''}, {name: 'electric', url: ''}]
			firstPokemonTypeResp.data.damage_relations.double_damage_from.forEach((e) => {
				weaknesses.push(e.name);
			});
			// weaknesses (at this point in time) = ['fire', 'electric']
			if (pokemonDetailsResp.data.types.length > 1) {
				const secondPokemonTypeResp = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonDetailsResp.data.types[1].type.name}`);
				// [{name: 'rock', url: ''}]
				secondPokemonTypeResp.data.damage_relations.double_damage_from.forEach((e) => {
					// avoid duplicating types in our weaknesses array
					if (!weaknesses.includes(e.name)) {
						weaknesses.push(e.name);
					}
				});
			}
			// we want an array to look like this: so we can map over it easily
			// ['fire', 'electric', 'rock']
			// we DONT want the array to look like this:
			// [['fire', 'electric'], ['rock']]
			console.log(weaknesses);
			setPokeWeakness(weaknesses);

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
		<div className={`App bg-${pokemonData?.types?.[0]?.type?.name}`}>
			<div className='Title'>PokeDex Project</div>
			{isLoading ? (
				<SpinnerCircular enabled={isLoading} />
			) : (
				<>
					{pokemonData && (
						<div className='title-wrapper'>
							<h1>{pokemonData.name}</h1>
							<h2>Pokemon #{pokemonData.id}</h2>
						</div>
					)}
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
