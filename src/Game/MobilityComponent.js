function MobilityComponent(_actorSystem, _actor, _velocityMeterPerSecond, _terrain, _mouse) {

	const _repulsionVelocityMax = _velocityMeterPerSecond + 1
	const _displacementMin = 0.001
	let _targetId = undefined
	let _repulsionVelocity = Vector2D(0.0, 0.0)

	function update(deltaTimeMillisecond) {
		const targetActor = _actorSystem.findActor(_targetId)
		if (targetActor === undefined) return

		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		const forceLimit = 2.0;
		_repulsionVelocity = _repulsionVelocity
				.add(_terrain.getRepulsionForce(_actor).scalarMultiply(deltaTimeSecond))
				.cut(_terrain.forceMax())
		const displacement = Vector2D(_mouse.x(), _mouse.y())
				.substract(_actor.getPosition())
				.cut(_velocityMeterPerSecond * deltaTimeSecond)
				.add(_repulsionVelocity
						//Guaranty that the repulsion will be greater than the velocity of the mobility
						.scalarMultiply(deltaTimeSecond * _velocityMeterPerSecond))
		_actor.setPosition(_actor.getPosition()
				.add(displacement.squareDistance() < _displacementMin * _displacementMin
						? Vector2D.ZERO
						: displacement))

		//Keep inside the field
		const position = _actor.getPosition()
		_actor.setPosition(Vector2D(
			clamp(0.0, position.x(), _terrain.width()),
			clamp(0.0, position.y(), _terrain.height())
		))

		const decayFactor = 0.9
		_repulsionVelocity = _repulsionVelocity.scalarMultiply(decayFactor)
	}

	function setTarget(actorId) { _targetId = actorId }

	return {update, setTarget}
}
