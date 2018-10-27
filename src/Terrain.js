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

	function calculateForce(actor, cell) {
		const x = Math.floor(actor.x())
		const y = Math.floor(actor.y())
		if (cell.x() < 0 || cell.x() >= width()) return
		if (cell.y() < 0 || cell.y() >= height()) return
		const actorToCenter = _voxelCenter[cell.x()][cell.y()]
				.substract(actor.getPosition())
		const squareDistance = actorToCenter.squareDistance()
		if (squareDistance < VECTOR_2D_EPSILON) return
		const force = actorToCenter.scalarMultiply(_forceConstant/squareDistance)
		_forceField[cell.x()][cell.y()] = _forceField[cell.x()][cell.y()]
				.add(force)
	}

	function update(actors) {
		//Initialize the force field
		for (let x = 0; x < width(); x++) {
			for (let y = 0; y < height(); y++) {
				_forceField[x][y] = Vector2D.ZERO
			}
		}

		actors.forEach(actor => {
			const x = Math.floor(actor.x())
			const y = Math.floor(actor.y())
			_areaOfEffect.forEach(v => {
				const cell = Vector2D(x, y).add(v)
				if (cell.x() < 0 || cell.x() >= width()) return
				if (cell.y() < 0 || cell.y() >= height()) return
				const actorToCenter = _voxelCenter[cell.x()][cell.y()]
						.substract(actor.getPosition())
				const squareDistance = actorToCenter.squareDistance()
				if (squareDistance < VECTOR_2D_EPSILON) return
				const force = actorToCenter.scalarMultiply(_forceConstant/squareDistance)
				_forceField[cell.x()][cell.y()] = _forceField[cell.x()][cell.y()]
						.add(force)
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
