function SimpleAI(actor) {
	
	function update(deltaTimeMillisecond, locationSystem) {
		const enemy = locationSystem.nearestEnemy(actor.id())
	}

	return {update}
}
