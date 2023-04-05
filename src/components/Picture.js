const Picture = (props) => {
	console.log(props);
	return (
		<div>
			<img src={props.sprite} width='200px' height='px' />
		</div>
	);
};

export default Picture;
