function MobilityComponent(_actorSystem, _actor) {

	var _targetId = undefined

	function update(deltaTimeMillisecond) {
		const targetActor = _actorSystem.findActor(_targetId)
		if (targetActor === undefined) return

		var x = 0
		if (targetActor.x() > _actor.x() + 1) x = 1
		else if (targetActor.x() < _actor.x() - 1) x = -1

		var y = 0
		if (targetActor.y() > _actor.y() + 1) y = 1
		else if (targetActor.y() < _actor.y() - 1) y = -1

		_actor.setPosition(_actor.getPosition().add(Vector(x, y)))
	}

	function setTarget(actorId) { _targetId = actorId }

	return {update, setTarget}
}
