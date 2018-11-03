function ActorSystem(_terrain, _particleSystem) {
	const _actors = []
	let _nextActorId = 0

	function createActor() {
		const actor = Actor(_nextActorId)
		_actors.push(actor)
		_nextActorId++
		return actor
	}

	function init() {
		for (let i = 0; i < _actors.length; i++) {
			_particleSystem.setParticlePosition(i, _actors[i].getPosition())
		}
	}

	function update(deltaTimeMillisecond, canvas) {
		_actors.forEach(actor => actor.updateBattle(deltaTimeMillisecond))

		for (let i = 0; i < _actors.length; i++) {
			_particleSystem.update(deltaTimeMillisecond)
			_actors[i].setPosition(_particleSystem.getParticlePosition(i))
		}

		const sortByPriority = (renderComponent1, renderComponent2) =>
				renderComponent2.priority() - renderComponent1.priority()
		_actors.reduce(
				(renderComponents, actor) => renderComponents.concat(actor.renderComponents()),
				[])
			.sort(sortByPriority)
			.forEach(renderComponent => renderComponent.render(canvas))
	}

	function findActor(actorId) {
		return _actors.find(actor => actor.id() === actorId)
	}

	function apply(updater) { updater(_actors) }

	return {createActor, init, update, findActor, apply}
}
