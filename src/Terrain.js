function Terrain(_worldProjection) {

	const _forceConstant = 100.0
	const _forceMax = 10000.0

	const _forceField = []
	for (let x = 0; x < width(); x++) {
		_forceField[x] = []
		for (let y = 0; y < height(); y++) {
			_forceField[x][y] = Vector2D.ZERO
		}
	}

	const _voxelCenter = []
	for (let x = 0; x < width(); x++) {
		_voxelCenter[x] = []
		for (let y = 0; y < height(); y++) {
			_voxelCenter[x][y] = Vector2D(x+0.5, y+0.5)
		}
	}

	const _areaOfEffect = [
		Vector2D(0, -2),
		Vector2D(-1, -1),
		Vector2D(0, -1),
		Vector2D(1, -1),
		Vector2D(-2, 0),
		Vector2D(-1, 0),
		Vector2D(0, 0),
		Vector2D(1, 0),
		Vector2D(2, 0),
		Vector2D(-1, 1),
		Vector2D(0, 1),
		Vector2D(1, 1),
		Vector2D(0, 2)
	]

	function isValidCellX(cellX) { return 0 <= cellX && cellX < width() }
	function isValidCellY(cellY) { return 0 <= cellY && cellY < height() }

	function width() { return 25 }
	function height() { return 25 }

	function calculateForce(actor, cellX, cellY) {
		if (!isValidCellX(cellX)) return Vector2D.ZERO
		if (!isValidCellY(cellY)) return Vector2D.ZERO
		const actorToCenter = _voxelCenter[cellX][cellY]
				.substract(actor.getPosition())
		const squareDistance = actorToCenter.squareDistance()
		if (squareDistance < VECTOR_2D_EPSILON) return Vector2D.ZERO
		return actorToCenter.scalarMultiply(_forceConstant/squareDistance)
	}

	function update(actors) {
		//Initialize the force field
		for (let x = 0; x < width(); x++) {
			for (let y = 0; y < height(); y++) {
				_forceField[x][y] = Vector2D.ZERO
			}
		}

		actors.forEach(actor => {
			const cellX = Math.floor(actor.x())
			const cellY = Math.floor(actor.y())
			_areaOfEffect.forEach(v => {
				const x = cellX + v.x()
				const y = cellY + v.y()
				if (!isValidCellX(x)) return Vector2D.ZERO
				if (!isValidCellY(y)) return Vector2D.ZERO
				_forceField[x][y] = _forceField[x][y].add(calculateForce(actor, x, y))
			})
		})
	}

	function getRepulsionForce(actor) {
		let force = Vector2D.ZERO

		let distance2Max = 1.0
		for (let xOffset = 0; xOffset < 2; xOffset++) {
			for (let yOffset = 0; yOffset < 2; yOffset++) {
				const cellX = Math.floor(actor.x() - 0.5) + xOffset
				const cellY = Math.floor(actor.y() - 0.5) + yOffset
				if (!isValidCellX(cellX) || !isValidCellY(cellY)) continue
				const distance2 = _voxelCenter[cellX][cellY]
						.substract(actor.getPosition())
						.squareDistance()
				distance2Max += distance2
			}
		}

		for (let xOffset = 0; xOffset < 2; xOffset++) {
			for (let yOffset = 0; yOffset < 2; yOffset++) {
				const cellX = Math.floor(actor.x() - 0.5) + xOffset
				const cellY = Math.floor(actor.y() - 0.5) + yOffset
				if (!isValidCellX(cellX) || !isValidCellY(cellY)) continue
				const distance2 = _voxelCenter[cellX][cellY]
						.substract(actor.getPosition())
						.squareDistance()
				const weightedCellForce = _forceField[cellX][cellY]
						.substract(calculateForce(actor, cellX, cellY))
						.scalarMultiply(1-distance2/distance2Max)
				force = force.add(weightedCellForce)
			}
		}
		return force.cut(_forceMax)
	}

	function getRepulsionForceDeprecated(actor) {
		const cellX = Math.floor(actor.x())
		const cellY = Math.floor(actor.y())
		if (!isValidCellX(cellX)) return Vector2D.ZERO
		if (!isValidCellY(cellY)) return Vector2D.ZERO

		return _forceField[cellX][cellY]
				.substract(calculateForce(actor, cellX, cellY))
				.cut(_forceMax)
	}

	function renderForceField(canvas) {
		canvas.save()
		canvas.strokeStyle = "green"

		for (let x = 0; x < width(); x++) {
			for (let y = 0; y < height(); y++) {
				if (_forceField[x][y].isZero()) continue
				const begin = _worldProjection.toScreenCoordinates(_voxelCenter[x][y])
				const force = _forceField[x][y].scalarMultiply(1/_forceConstant)
				const end = _worldProjection.toScreenCoordinates(_voxelCenter[x][y].add(force))
				drawVector(canvas, begin, end)
			}
		}
		canvas.restore()
	}

	return {width, height, update, getRepulsionForce, renderForceField}
}
