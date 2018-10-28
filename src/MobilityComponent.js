function MobilityComponent(_actorSystem, _actor, _velocityMeterPerSecond, _terrain, _mouse) {

	let _targetId = undefined
	const _repulsionVelocityMax = _velocityMeterPerSecond + 1
	const _displacementMin = 0.001

	function update(deltaTimeMillisecond) {
		const targetActor = _actorSystem.findActor(_targetId)
		if (targetActor === undefined) return

		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		const forceLimit = 2.0;
		const repulsionDisplacement = _terrain
				.getRepulsionForce(_actor)
				.cut(_terrain.forceMax())
				.scalarMultiply(deltaTimeSecond * _velocityMeterPerSecond / forceLimit)
//		const repulsionDisplacement = _terrain
//				.getRepulsionForce(_actor)
//				.scalarMultiply(deltaTimeSecond)
//				.cut(_repulsionVelocityMax * deltaTimeSecond)
		const displacement = Vector2D(_mouse.x(), _mouse.y())
				.substract(_actor.getPosition())
				.cut(_velocityMeterPerSecond * deltaTimeSecond)
				.add(repulsionDisplacement)
		_actor.setPosition(_actor.getPosition()
				.add(displacement.squareDistance() < _displacementMin * _displacementMin
						? Vector2D.ZERO
						: displacement))
	}

	function setTarget(actorId) { _targetId = actorId }

	return {update, setTarget}
}
