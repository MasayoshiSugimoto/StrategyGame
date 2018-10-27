function Terrain(_worldProjection) {

	const _forceConstant = 1.0
	const _forceMax = 3.0

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

	function width() { return 25 }
	function height() { return 25 }

	function calculateForce(actor, cellX, cellY) {
		if (cellX < 0 || cellX >= width()) return Vector2D.ZERO
		if (cellY < 0 || cellY >= height()) return Vector2D.ZERO
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
				if (x < 0 || x >= width()) return Vector2D.ZERO
				if (y < 0 || y >= height()) return Vector2D.ZERO
				_forceField[x][y] = _forceField[x][y].add(calculateForce(actor, x, y))
			})
		})
	}

	function renderForceField(canvas) {
		canvas.save()
		canvas.strokeStyle = "green"

		for (let x = 0; x < width(); x++) {
			for (let y = 0; y < height(); y++) {
				if (_forceField[x][y].isZero()) continue
				const begin = _worldProjection.toScreenCoordinates(_voxelCenter[x][y])
				const end = _worldProjection.toScreenCoordinates(
						_voxelCenter[x][y].add(_forceField[x][y]))
				drawVector(canvas, begin, end)
			}
		}
		canvas.restore()
	}

	return {width, height, update, renderForceField}
}
