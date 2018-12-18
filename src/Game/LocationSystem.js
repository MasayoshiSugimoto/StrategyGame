function LocationSystem(actors) {
	const _nearestEnemies = actors.map(actor => {
		actorId: actor.id(),
		nearestEnemy: actors[0]
	})

	function nearestActor(actorId) {
		return filter(nearestEntry => nearestEntry.actorId === actorId)
				.nearestEnemy
	}

	return {nearestActor}
}
