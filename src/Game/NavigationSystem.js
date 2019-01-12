function NavigationSystem(_mouse, _terrain) {

	const _pathFinder = PathFinder(_terrain)
	const CELL_CENTER_OFFSET = Vector2D(Terrain.CELL_SIZE_METER/2, Terrain.CELL_SIZE_METER/2)

	function update(actors) {
		actors
			.filter(actor => actor.getComponent(ActorComponentId.NAVIGATION))
			.forEach(actor => {
				const navigationComponent = actor.getComponent(ActorComponentId.NAVIGATION)
				const start = _terrain.toCell(actor.getPosition())
				const end = _terrain.toCell(_mouse)
				navigationComponent.path = _pathFinder.findPath(
					{x: start.x(), y: start.y()},
					{x: end.x(), y: end.y()}
				)

				if (navigationComponent.path.length === 0 || navigationComponent.path.length === 1) {
					navigationComponent.target = actor.getPosition()
				} else {
					navigationComponent.target = navigationComponent.path[1]
							.add(CELL_CENTER_OFFSET)
				}
			})
	}

	return {update}
}

NavigationSystem.createComponent = function() {
	return {
		path: [],
		target: Vector2D.ZERO,
		calculateAcceleration: NavigationSystem.actorAcceleration
	}
}

NavigationSystem.actorAcceleration = function(actor) {
	const navigationComponent = actor.getComponent(ActorComponentId.NAVIGATION)
	if (navigationComponent === undefined) return undefined
	//If it's targeting itself don't do anything
	if (navigationComponent.target.equals(actor.getPosition())) return undefined
	return navigationComponent.target
			.substract(actor.getPosition())
			.resize(NAVIGATION_SYSTEM_ACTOR_ACCELERATION)
}

const NAVIGATION_SYSTEM_ACTOR_ACCELERATION = 10.0
