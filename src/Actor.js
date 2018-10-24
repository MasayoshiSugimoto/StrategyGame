function Actor(_id) {
	var _healthComponent = EmptyHealthComponent()
	var _mobilityComponent = EmptyComponent()
	var _renderComponents = []
	var _position = Vector(0.0, 0.0)

	function id() { return _id }
	function getPosition() { return _position }
	function setPosition(position) { _position = position }
	function x() { return _position.x() }
	function y() { return _position.y() }
	function setHealthComponent(component) { _healthComponent = component }
	function setMobilityComponent(component) { _mobilityComponent = component }
	function addRenderComponent(component) { _renderComponents.push(component) }

	function updateBattle(deltaTimeMillisecond) {
		_mobilityComponent.update(deltaTimeMillisecond)
		_healthComponent.update()
	}

	function render(canvas) {
		_renderComponents.forEach(component => component.render(canvas))
	}

	return {
		id,
		getPosition,
		setPosition,
		x,
		y,
		setHealthComponent,
		setMobilityComponent,
		addRenderComponent,
		updateBattle,
		render
	}
}

function EmptyComponent() {
	return {update: (deltaTimeMillisecond) => {}}
}
