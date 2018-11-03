function ParticleSystem(_fieldSize, _restLength, _mouse) {

	function Particle(position) {
		return {
			_position: position,
			_oldPosition: position,
			_acceleration: Vector2D.ZERO
		}
	}

	function applyForces(deltaTimeSecond) {
		const mouse = Vector2D(_mouse.x(), _mouse.y())
		_particles.forEach(particle => {
			const particle2Mouse =  mouse.substract(particle._position)
			particle._acceleration = particle2Mouse.cut(2.0)
		})
	}

	function verlet(deltaTimeSecond) {
		_particles.forEach(particle => {
			const tmpVector = particle._position
			particle._position = particle._position.add(
				particle._position
						.substract(particle._oldPosition)
						.add(particle._acceleration.scalarMultiply(deltaTimeSecond*deltaTimeSecond))
						.scalarMultiply(0.9))
			particle._oldPosition = tmpVector
		})
	}

	function satisfyConstraints() {
		const minDistance = 2 * VECTOR_2D_EPSILON

		const randomVector = () =>
				Vector2D(Math.random() * minDistance, Math.random() * minDistance)

		for (let i = 0; i < 1; i++) {
			_particles.forEach(particle1 => {
				particle1._position = particle1._position
						.max(Vector2D.ZERO)
						.min(_fieldSize)

				_particles.forEach(particle2 => {
					if (particle1 === particle2) return
					const delta = particle2._position.substract(particle1._position)
					const deltaLength = Math.sqrt(delta.dot(delta))
					if (deltaLength <= VECTOR_2D_EPSILON) {
						return
						particle1._position = particle1._position.add(randomVector())
						particle2._position = particle2._position.add(randomVector())
					} else if (deltaLength < _restLength) {
						const diff = (_restLength - deltaLength) / deltaLength
						const dx = delta.scalarMultiply(0.5*diff)
								.cut(0.001)
						particle1._position = particle1._position.substract(dx)
						particle2._position = particle2._position.add(dx)
					}
				})
			})
		}
	}

	function update(deltaTimeMillisecond) {
		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		applyForces(deltaTimeSecond)
		verlet(deltaTimeSecond)
		satisfyConstraints()
	}

	function getParticlePosition(index) {
		return _particles[index]._position
	}

	function setParticlePosition(index, position) {
		if (_particles[index] === undefined)
			_particles[index] = Particle(position)
		else
			_particles[index]._position = position
	}

	const _particles = []

	return {update, getParticlePosition, setParticlePosition}
}
