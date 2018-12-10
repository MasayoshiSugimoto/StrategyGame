function ParticleSystem(_terrain, _restLength, _mouse) {

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
		//Apply collision
		const cellSize = _terrain.cellSize()
		const cell = particle._position
			.map(d => Math.floor(d) * cellSize)

		if (_terrain.isTraversable(cell)) return

		const collisionEdges = {x: NaN, y: NaN}
		{//Find the possible edges involved in the collision
			const oldX = particle._oldPosition.x()
			if (oldX <= cell.x()) {
				collisionEdges.x = cell.x()
			} else if (oldX > cell.x() + cellSize) {
				collisionEdges.x = cell.x() + cellSize
			}
			const oldY = particle._oldPosition.y()
			if (oldY <= cell.y()) {
				collisionEdges.y = cell.y()
			} else if (oldY > cell.y() + cellSize) {
				collisionEdges.y = cell.y() + cellSize
			}
		}

		//Calculate the colliding edge (Using Affine transformation)
		const x = particle._position.x()
		const y = particle._position.y()
		const deltaPosition = particle._position
			.substract(particle._oldPosition)
		const lambdaY = (collisionEdges.y - particle._oldPosition.y()) / y
		const impactX = particle._oldPosition
				.add(deltaPosition.scalarMultiply(lambdaY))
				.x()
		const lambdaX = (collisionEdges.x - particle._oldPosition.x()) / x
		const impactY = particle._oldPosition
				.add(deltaPosition.scalarMultiply(lambdaX))
				.y()
		if (!isNaN(impactX) 
				&& !isNaN(collisionEdges.y)
				&& impactX >= cell.x()
				&& impactX <= cell.x() + cellSize
				&& (deltaPosition.y() > 0
						? !_terrain.isWall(cell.x(), cell.y()-1)
						: !_terrain.isWall(cell.x(), cell.y()+1))) {
			particle._position = Vector2D(x, collisionEdges.y)
		} else if (!isNaN(impactY)
				&& !isNaN(collisionEdges.x)
				&& impactY >= cell.y()
				&& impactY <= cell.y() + cellSize
				&& (deltaPosition.x() >= 0
						? !_terrain.isWall(cell.x()-1, cell.y())
						: !_terrain.isWall(cell.x()+1, cell.y()))) {
			particle._position = Vector2D(collisionEdges.x, y)
		}
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
