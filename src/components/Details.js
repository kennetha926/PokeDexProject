const Details = (props) => {
	return (
		<div>
			<h2>Type</h2>
			{props.types.map((e, index) => {
				return (
					<div className={`typeStyle ${e.type.name}`} key={index}>
						{e.type.name}
					</div>
				);
			})}
			<h2>Weaknesses</h2>
			{props.weaknesses.map((e, index) => {
				console.log(e);
				return (
					<div className={`typeStyle ${e}`} key={index}>
						{e}
					</div>
				);
			})}
		</div>
	);
};

export default Details;
