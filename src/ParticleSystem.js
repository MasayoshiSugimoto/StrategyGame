function ParticleSystem(_terrain, _restLength, _mouse, _collisionRectangles) {

	const CONSTRAINT_ITERATION_NUMBER = 1
	const ENERGY_CONSERVATION = 0.97
	const _fieldSize = Vector2D(_terrain.width(), _terrain.height())

	function Particle(_position, _id) {
		return {
			_id,
			_position,
			_oldPosition: _position,
			_acceleration: Vector2D.ZERO,
			_active: true
		}
	}

	function applyForces(deltaTimeSecond) {
		const mouse = Vector2D(_mouse.x(), _mouse.y())
		const acceleration = 10.0
		_particles.forEach(particle => {
			const particle2Mouse =  mouse.substract(particle._position)
			particle._acceleration = particle2Mouse.cut(acceleration)
		})
	}

	function verlet(deltaTimeSecond) {
		_particles.forEach(particle => {
			const tmpVector = particle._position
			particle._position = particle._position.add(
				particle._position
						.substract(particle._oldPosition)
						.add(particle._acceleration.scalarMultiply(deltaTimeSecond*deltaTimeSecond))
						.scalarMultiply(ENERGY_CONSERVATION))
			particle._oldPosition = tmpVector
		})
	}

	function applyTerrainCollision(particle) {
		const x = particle._position.x()
		const y = particle._position.y()

		_collisionRectangles.forEach(rectangle => {
			const top = rectangle.y
			const bottom = rectangle.y+rectangle.height
			const left = rectangle.x
			const right = rectangle.x+rectangle.width
			const centerX = left+rectangle.width/2.0
			const centerY = top+rectangle.height/2.0

			if (left < x && x < right && top < y && y < bottom) {
				[
					{diff: x-left, f: () => particle._position = new Vector2D(left, y)},
					{diff: right-x, f: () => particle._position = new Vector2D(right, y)},
					{diff: y-top, f: () => particle._position = new Vector2D(x, top)},
					{diff: bottom-y, f: () => particle._position = new Vector2D(x, bottom)}
				]
				.reduce((selectedEffect, effect) => {
						return effect.diff < selectedEffect.diff
								? effect
								: selectedEffect
					}, {diff: Number.MAX_VALUE, f: () => {}})
				.f()
			}
		})
	}

	function satisfyConstraints() {
		const minDistance = 2 * VECTOR_2D_EPSILON
		const cellSize = _terrain.cellSize()

		const randomVector = () =>
				Vector2D(Math.random() * minDistance, Math.random() * minDistance)

		for (let i = 0; i < CONSTRAINT_ITERATION_NUMBER; i++) {
			_particles.forEach(particle1 => {
				//Keep particles in the terrain
				particle1._position = particle1._position
						.max(Vector2D.ZERO)
						.min(_fieldSize)

				applyTerrainCollision(particle1)

				//Collision between particles
				_particles.forEach(particle2 => {
					if (particle1 === particle2) return
					const delta = particle2._position.substract(particle1._position)
					const deltaLength = Math.sqrt(delta.dot(delta))
					if (deltaLength <= VECTOR_2D_EPSILON) {
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
		clean()
		applyForces(deltaTimeSecond)
		verlet(deltaTimeSecond)
		satisfyConstraints()
	}

	function createParticle(position, id) {
		_particles.push(Particle(position, id))
	}

	function particlePositions() {
		return _particles.map(particle => ({
			id: () => particle._id,
			position: () => particle._position
		}))
	}

	function setInactive(id) {
		const particle = _particles.find(particle => particle._id === id)
		if (particle !== undefined) particle._active = false
	}

	function clean() {
		_particles = _particles.filter(particle => particle._active)
	}

	let _particles = []

	return {
		update,
		createParticle,
		particlePositions,
		setInactive
	}
}
