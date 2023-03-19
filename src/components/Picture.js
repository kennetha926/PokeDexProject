const Picture = (props) => {
	console.log(props);
	return (
		<div>
			<img src={props.sprite} />
		</div>
	);
};

export default Picture;
