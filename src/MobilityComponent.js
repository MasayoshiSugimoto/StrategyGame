function MobilityComponent(_actorSystem, _actor, _velocityMeterPerSecond) {

	var _targetId = undefined

	function update(deltaTimeMillisecond) {
		const targetActor = _actorSystem.findActor(_targetId)
		if (targetActor === undefined) return

		const displacement = targetActor
				.getPosition()
				.substract(_actor.getPosition())
				.cut(_velocityMeterPerSecond * deltaTimeMillisecond / 1000.0)
		_actor.setPosition(_actor.getPosition().add(displacement))
	}

	function setTarget(actorId) { _targetId = actorId }

	return {update, setTarget}
}
