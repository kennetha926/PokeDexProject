const Stats = (props) => {
	return (
		<div>
			<h1>{props.name}</h1>
			{props.stats.map((e, index) => {
				return (
					<div key={index}>
						<label htmlFor='pokeStats'>{e.stat.name}</label>
						<progress id='pokeStats' value={e.base_stat} max='255'></progress>
					</div>
				);
			})}
		</div>
	);
};

export default Stats;
