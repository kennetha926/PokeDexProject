const Evolution = (props) => {
	return (
		<>
			<p className='card-title'>Evolution Chain</p>
			<div className='evolution-wrapper'>
				{props.evolution.map((e, index) => {
					return (
						<div key={index}>
							<p>{e.name}</p>
							<img src={e.sprite} />
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Evolution;
