function ActorSystem() {
	const _actors = []
	let _nextActorId = 0

	function createActor() {
		const actor = Actor(_nextActorId)
		_actors.push(actor)
		_nextActorId++
		return actor
	}

	function update(deltaTimeMillisecond) {
		_actors.forEach(actor => actor.updateBattle(deltaTimeMillisecond))
		GridRenderer(_actors)
	}

	return {createActor, update}
}
