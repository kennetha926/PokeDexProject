const Details = (props) => {
	return (
		<div>
			{props.types.map((e, index) => {
				return <div key={index}> {e.type.name} </div>;
			})}
			{props.weaknesses.map((e, index) => {
				console.log(e);
				return <div key={index}> {e.name}</div>;
			})}
		</div>
	);
};

export default Details;
