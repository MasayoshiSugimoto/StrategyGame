function ActorSystem(_terrain) {
	const _actors = []
	let _nextActorId = 0

	function createActor() {
		const actor = Actor(_nextActorId)
		_actors.push(actor)
		_nextActorId++
		return actor
	}

	function update(deltaTimeMillisecond, canvas) {
		_actors.forEach(actor => actor.updateBattle(deltaTimeMillisecond))
		_actors.forEach(actor => actor.render(canvas))
	}

	function findActor(actorId) {
		return _actors.find(actor => actor.id() === actorId)
	}

	return {createActor, update, findActor}
}
