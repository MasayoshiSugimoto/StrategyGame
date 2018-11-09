function Terrain(_worldProjection, _terrainData) {

	const _forceConstant = 4
	const _forceMax = 10.0
	const _debugVectorFactor = 1

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

	let _debugRepulsions = []

	const _isTraversable = []
	{
		let lines = _terrainData.split("\n")
		//Remove first and last line
		lines = lines.splice(1, lines.length-2)
		for (let x = 0; x < width(); x++) {
			_isTraversable[x] = []
			for (let y = 0; y < height(); y++) {
				_isTraversable[x][y] = lines[y][x] === '0'	
			}
		}
	}
	
	function isValidCellX(cellX) { return 0 <= cellX && cellX < width() }
	function isValidCellY(cellY) { return 0 <= cellY && cellY < height() }

	function width() { return 60 }
	function height() { return 30 }
	function forceMax() { return _forceMax }

	function calculateForce(actor, cellX, cellY) {
		if (!isValidCellX(cellX)) return Vector2D.ZERO
		if (!isValidCellY(cellY)) return Vector2D.ZERO
		let actorToCenter = _voxelCenter[cellX][cellY]
				.substract(actor.getPosition())
		const squareDistance = actorToCenter.squareDistance()
		if (squareDistance < VECTOR_2D_EPSILON*VECTOR_2D_EPSILON) {
			actorToCenter = Vector2D(2 * VECTOR_2D_EPSILON, 0.0)
		}
		return actorToCenter
				.scalarMultiply(_forceConstant/squareDistance)
				.cut(_forceMax)
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
			for (let xOffset = -3; xOffset <= 3; xOffset++) {
				for (let yOffset = -3; yOffset <= 3; yOffset++) {
					const x = cellX + xOffset
					const y = cellY + yOffset
					if (!isValidCellX(x)) continue
					if (!isValidCellY(y)) continue
					_forceField[x][y] = _forceField[x][y].add(calculateForce(actor, x, y))
				}
			}
		})
	}

	function getRepulsionForce(actor) {

		const forInterpolationArea = (f) => {
			for (let xOffset = 0; xOffset <= 1; xOffset++) {
				const x = Math.floor(actor.x() - 0.5) + xOffset
				for (let yOffset = 0; yOffset <= 1; yOffset++) {
					const y = Math.floor(actor.y() - 0.5) + yOffset
					f(x, y)
				}
			}
		}

		let distance2Max = 0.0
		forInterpolationArea((cellX, cellY) => {
			if (!isValidCellX(cellX) || !isValidCellY(cellY)) return
			distance2Max += _voxelCenter[cellX][cellY]
					.substract(actor.getPosition())
					.squareDistance()
		})
		distance2Max = Math.max(distance2Max, 0.1) //Just to be safe

		let force = Vector2D.ZERO
		forInterpolationArea((cellX, cellY) => {
			if (!isValidCellX(cellX) || !isValidCellY(cellY)) return
			const distance2 = _voxelCenter[cellX][cellY]
					.substract(actor.getPosition())
					.squareDistance()
			const weightedCellForce = _forceField[cellX][cellY]
					.substract(calculateForce(actor, cellX, cellY))
					.scalarMultiply(1-distance2/distance2Max)
			force = force.add(weightedCellForce)
		})

		_debugRepulsions.push({
			begin: _worldProjection.toScreenCoordinates(actor.getPosition()),
			end: _worldProjection.toScreenCoordinates(actor
					.getPosition()
					.add(force.scalarMultiply(1/_forceConstant)))
		})
		return force
	}

	function getRepulsionDisplacement(actor, deltaTimeSecond, velocity) {
		return getRepulsionForce(actor)
				.cut(_forceMax)
				.scalarMultiply(deltaTimeSecond * (velocity + 1.0) / _forceMax)
	}

	function renderForceField(canvas) {
		canvas.save()
		canvas.strokeStyle = "green"

		for (let x = 0; x < width(); x++) {
			for (let y = 0; y < height(); y++) {
				if (_forceField[x][y].isZero()) continue
				const begin = _worldProjection.toScreenCoordinates(_voxelCenter[x][y])
				const force = _forceField[x][y].scalarMultiply(1)
				const end = _worldProjection.toScreenCoordinates(
						_voxelCenter[x][y].add(force.scalarMultiply(1/_forceConstant)))
				drawVector(canvas, begin, end)
			}
		}

		canvas.strokeStyle = "red"
		_debugRepulsions.forEach(repulsionInfo => {
			drawVector(canvas, repulsionInfo.begin, repulsionInfo.end)
		})

		canvas.restore()

		_debugRepulsions = []
	}

	function isTraversable(cell) {
		return _isTraversable[cell.x()][cell.y()]
	}

	function forTraversable(f) {
		for (let x = 0; x < _isTraversable.length; x++) {
			for (let y = 0; y < _isTraversable[x].length; y++) {
				f(x, y, _isTraversable[x][y])
			}
		}
	}

	return {
		width,
		height,
		forceMax,
		update,
		getRepulsionForce,
		renderForceField,
		isTraversable,
		forTraversable
	}
}
