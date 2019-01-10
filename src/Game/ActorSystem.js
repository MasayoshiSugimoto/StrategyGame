function ActorSystem(_particleSystem) {
	const _actors = []
	let _nextActorId = 0

	function createActor() {
		const actor = Actor(_nextActorId)
		_actors.push(actor)
		_nextActorId++
		return actor
	}

	function findActor(actorId) {
		return _actors.find(actor => actor.id() === actorId)
	}

	function getActors() { return _actors }

	return {createActor, findActor, getActors}
}
