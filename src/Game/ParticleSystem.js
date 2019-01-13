function ParticleSystem(_terrain, _restLength, _mouse, _collisionRectangles) {

	const CONSTRAINT_ITERATION_NUMBER = 5
	const ENERGY_CONSERVATION = 0.97
	const _fieldSize = Vector2D(_terrain.width(), _terrain.height())

	function applyForces(actors) {
		actors.forEach(actor => {
			const particleComponent = actor.getComponent(
				ActorComponentId.PARTICLE_SYSTEM
			)
			if (particleComponent === undefined) return

			const acceleration = particleComponent._calculateAcceleration(actor)
			if (acceleration === undefined) return

			particleComponent._acceleration = acceleration
		})
	}

	function verlet(actors, deltaTimeSecond) {
		actors.forEach(actor => {
			const particleComponent = actor.getComponent(
				ActorComponentId.PARTICLE_SYSTEM
			)
			if (particleComponent === undefined) return
			const displacement = actor.getPosition()
					.substract(particleComponent._oldPosition)
					.add(particleComponent._acceleration
							.scalarMultiply(deltaTimeSecond*deltaTimeSecond))
					.scalarMultiply(ENERGY_CONSERVATION)
			const newPosition = actor.getPosition().add(displacement)
			particleComponent._oldPosition = actor.getPosition()
			actor.setPosition(newPosition)
		})
	}

	function satisfyConstraints(actors) {
		const minDistance = 2 * VECTOR_2D_EPSILON

		const randomVector = () =>
				Vector2D(Math.random() * minDistance, Math.random() * minDistance)

		for (let i = 0; i < CONSTRAINT_ITERATION_NUMBER; i++) {
			actors.forEach(actor1 => {
				const particleComponent = actor1.getComponent(
					ActorComponentId.PARTICLE_SYSTEM
				)
				if (particleComponent === undefined) return

				//Collision between actors
				actors.forEach(actor2 => {
					if (actor1 === actor2) return
					const delta = actor2.getPosition().substract(actor1.getPosition())
					const deltaLength = Math.sqrt(delta.dot(delta))
					if (deltaLength <= VECTOR_2D_EPSILON) {
						actor1.setPosition(actor1.getPosition().add(randomVector()))
						actor2.setPosition(actor2.getPosition().add(randomVector()))
					} else if (deltaLength < _restLength) {
						const diff = (_restLength - deltaLength) / deltaLength
						const dx = delta.scalarMultiply(0.5*diff)
								.cut(0.001)
						actor1.setPosition(actor1.getPosition().substract(dx))
						actor2.setPosition(actor2.getPosition().add(dx))
					}
				})

				//We need to apply the collision detection twice when there
				//the entity enters a collision block by the corner
				for (let i = 0; i < 2; i++) {
					Terrain.applyTerrainCollision(_collisionRectangles, actor1)
				}

				//Keep actor in the terrain
				actor1.setPosition(actor1.getPosition()
						.max(Vector2D.ZERO)
						.min(_fieldSize))
			})
		}
	}

	function update(deltaTimeMillisecond, actors) {
		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		applyForces(actors)
		verlet(actors, deltaTimeSecond)
		satisfyConstraints(actors)
	}

	return {update}
}

ParticleSystem.createComponent = function(position, calculateAcceleration) {
	return {
		_oldPosition: position,
		_acceleration: Vector2D.ZERO,
		_active: true,
		_calculateAcceleration: calculateAcceleration
	}
}
