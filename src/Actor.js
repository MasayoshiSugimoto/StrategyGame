function Actor(_id) {
	let _healthComponent = EmptyHealthComponent()
	let _mobilityComponent = EmptyComponent()
	let _renderComponents = []
	let _position = Vector(0.0, 0.0)

	function id() { return _id }
	function getPosition() { return _position }
	function setPosition(position) { _position = position }
	function x() { return _position.x() }
	function y() { return _position.y() }
	function setHealthComponent(component) { _healthComponent = component }
	function setMobilityComponent(component) { _mobilityComponent = component }
	function addRenderComponent(component) { _renderComponents.push(component) }
	function renderComponents() { return _renderComponents }

	function updateBattle(deltaTimeMillisecond) {
		_mobilityComponent.update(deltaTimeMillisecond)
		_healthComponent.update()
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
		renderComponents
	}
}

function EmptyComponent() {
	return {update: (deltaTimeMillisecond) => {}}
}
