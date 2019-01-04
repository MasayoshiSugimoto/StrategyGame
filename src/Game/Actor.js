function Actor(_id) {
	let _position = Vector2D(0.0, 0.0)
	const _components = {}

	function id() { return _id }
	function getPosition() { return _position }
	function setPosition(position) { _position = position }
	function x() { return _position.x() }
	function y() { return _position.y() }

	function addComponent(componentId, component) {
		_components[componentId] = component
	}

	function getComponent(componentId) {
		return _components[componentId]
	}

	return {
		id,
		getPosition,
		setPosition,
		x,
		y,
		addComponent,
		getComponent
	}
}
