function Actor(_id) {
	let _renderComponents = []
	let _position = Vector2D(0.0, 0.0)

	function id() { return _id }
	function getPosition() { return _position }
	function setPosition(position) { _position = position }
	function x() { return _position.x() }
	function y() { return _position.y() }
	function addRenderComponent(component) { _renderComponents.push(component) }
	function renderComponents() { return _renderComponents }

	function updateBattle(deltaTimeMillisecond) {
	}

	return {
		id,
		getPosition,
		setPosition,
		x,
		y,
		addRenderComponent,
		updateBattle,
		renderComponents
	}
}
