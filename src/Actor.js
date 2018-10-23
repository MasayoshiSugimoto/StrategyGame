function Actor(_id) {
	const _healthComponent = EmptyHealthComponent()
	const _renderComponents = []
	var _position = Vector(0.0, 0.0)

	function id() { return _id }
	function getPosition() { return _position }
	function setPosition(position) { _position = position }
	function x() { return _position.x() }
	function y() { return _position.y() }
	function setHealthComponent(component) { _healthComponent = component }
	function addRenderComponent(component) { _renderComponents.push(component) }

	function updateBattle(deltaTimeMillisecond) {
		_healthComponent.update()
	}

	function render() {
		_renderComponents.forEach(component => component.render())
	}

	return {
		id,
		getPosition,
		setPosition,
		x,
		y,
		setHealthComponent,
		addRenderComponent,
		updateBattle,
		render
	}
}
