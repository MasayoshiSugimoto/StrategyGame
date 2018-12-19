function ActorSystem(_terrain, _particleSystem, _canvas) {
	const _actors = []
	let _nextActorId = 0

	function createActor() {
		const actor = Actor(_nextActorId)
		_actors.push(actor)
		_nextActorId++
		return actor
	}

	function update(deltaTimeMillisecond) {
		const particles = _particleSystem.particlePositions()
		particles.forEach(particle => {
			_actors
					.find(actor => actor.id() === particle.id())
					.setPosition(particle.position())
		})

		const sortByPriority = (renderComponent1, renderComponent2) =>
				renderComponent2.priority() - renderComponent1.priority()
		_actors.reduce(
				(renderComponents, actor) => renderComponents.concat(actor.renderComponents()),
				[])
			.sort(sortByPriority)
			.forEach(renderComponent => renderComponent.render(_canvas))
	}

	function findActor(actorId) {
		return _actors.find(actor => actor.id() === actorId)
	}

	function apply(updater) { updater(_actors) }

	return {createActor, update, findActor, apply}
}
