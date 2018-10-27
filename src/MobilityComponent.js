function MobilityComponent(_actorSystem, _actor, _velocityMeterPerSecond, _terrain) {

	var _targetId = undefined
	const _repulsionVelocityMax = 3.0
	const _displacementMin = 0.01

	function update(deltaTimeMillisecond) {
		const targetActor = _actorSystem.findActor(_targetId)
		if (targetActor === undefined) return

		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		const displacement = targetActor
				.getPosition()
				.substract(_actor.getPosition())
				.cut(_velocityMeterPerSecond * deltaTimeSecond)
		const mass = 1.0
		const repulsionDisplacement = _terrain
				.getRepulsionForce(_actor)
				.scalarMultiply(deltaTimeSecond * deltaTimeSecond)
				.cut(_repulsionVelocityMax * deltaTimeSecond)
		const newPosition = _actor
				.getPosition()
				.add(displacement)
				.add(repulsionDisplacement.squareDistance() < _displacementMin * _displacementMin
						? Vector2D.ZERO
						: repulsionDisplacement)
		_actor.setPosition(newPosition)
	}

	function setTarget(actorId) { _targetId = actorId }

	return {update, setTarget}
}
