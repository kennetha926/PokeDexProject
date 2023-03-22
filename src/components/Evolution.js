const Evolution = (props) => {
	return (
		<div>
			{props.evolution.map((e, index) => {
				return (
					<div key={index}>
						<p>{e.name}</p>
						<img src={e.sprite} />
					</div>
				);
			})}
		</div>
	);
};

export default Evolution;
