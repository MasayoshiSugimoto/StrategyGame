function ActorSystem(_particleSystem, _canvas) {
	const _actors = []
	let _nextActorId = 0

	function createActor() {
		const actor = Actor(_nextActorId)
		_actors.push(actor)
		_nextActorId++
		return actor
	}

	function update() {
		const particles = _particleSystem.particlePositions()
		particles.forEach(particle => {
			_actors
					.find(actor => actor.id() === particle.id())
					.setPosition(particle.position())
		})
	}

	function findActor(actorId) {
		return _actors.find(actor => actor.id() === actorId)
	}

	function getActors() { return _actors }

	return {createActor, update, findActor, getActors}
}
