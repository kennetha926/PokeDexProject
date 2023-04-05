const Stats = (props) => {
	return (
		<>
			<p className='card-title'>Stats</p>
			<div style={{ height: '100%' }}>
				{props.stats.map((e, index) => {
					return (
						<div key={index} className='stat-wrapper'>
							<label htmlFor='pokeStats'>{e.stat.name}</label>
							<progress id='pokeStats' value={e.base_stat} max='255'></progress>
							<span>{e.base_stat}</span>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Stats;
