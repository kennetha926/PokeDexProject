const Details = (props) => {
	return (
		<div>
			<h1>{props.name}</h1>
			{props.types.map((e, index) => {
				return <div key={index}> {e.type.name} </div>;
			})}
		</div>
	);
};

export default Details;
