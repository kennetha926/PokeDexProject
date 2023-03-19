import { useEffect, useState } from 'react';
import axios from 'axios';

const Evolution = (props) => {
	const [evolutionChain, setEvolutionChain] = useState([]);

	const fetchPokemonData = async (url) => {
		try {
			const resp = await axios.get(url);
			setEvolutionChain((prevState) => {
				return [...prevState, resp.data];
			});
			console.log(resp.data);
		} catch (error) {
			alert('Not found!');
		}
	};

	useEffect(() => {
		(async () => {
			await fetchPokemonData(props.evolution.chain.evolves_to[0].species.url);
		})();
	}, []);

	return (
		<div>
			<span>{props.original.name}</span>
			<img src={props.original.sprite} />
			{props.evolution.chain.evolves_to.length > 0 && <span>{props.evolution.chain.evolves_to[0].species.name} </span>}
		</div>
	);
};

export default Evolution;
