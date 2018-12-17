function Terrain(_worldProjection, _terrainData) {

	const _forceConstant = 4
	const _forceMax = 10.0
	const _debugVectorFactor = 1
	const _height = _terrainData.split("\n").length - 2
	const _width = _terrainData.split("\n")[1].length

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

	const _walls = []
	{
		let lines = _terrainData.split("\n")
		//Remove first and last line
		lines = lines.splice(1, lines.length-2)
		const isWall = (x, y) => lines[y][x] !== '0'

		for (let x = 0; x < width(); x++) {
			_walls[x] = []
			for (let y = 0; y < height(); y++) {
				_walls[x][y] = isWall(x, y)
			}
		}
	}

	function isValidCellX(cellX) { return 0 <= cellX && cellX < width() }
	function isValidCellY(cellY) { return 0 <= cellY && cellY < height() }

	function width() { return _width }
	function height() { return _height }
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
		return !isWall(cell.x(), cell.y())
	}

	function isWall(x, y) {
		return !isValidX(x) || !isValidY(y) || _walls[x][y]
	}

	function forWalls(f) {
		for (let x = 0; x < _walls.length; x++) {
			for (let y = 0; y < _walls[x].length; y++) {
				f(x, y, !_walls[x][y])
			}
		}
	}

	function cellSize() { return 1 }
	function isValidX(x) { return 0 <= x && x < width() }
	function isValidY(y) { return 0 <= y && y < height() }

	return {
		width,
		height,
		forceMax,
		update,
		getRepulsionForce,
		renderForceField,
		isTraversable,
		isWall,
		forWalls,
		cellSize
	}
}

Terrain.string2Data = function(dataAsString) {
	let lines = dataAsString.split("\n")
	//Remove first and last line
	lines = lines.splice(1, lines.length-2)

	const _height = dataAsString.split("\n").length - 2
	const _width = dataAsString.split("\n")[1].length

	const walls = []
	for (let x = 0; x < _width; x++) {
		walls[x] = []
		for (let y = 0; y < _height; y++) {
			walls[x][y] = lines[y][x] !== '0'
		}
	}

	function isValidX(x) { return 0 <= x && x < _width }
	function isValidY(y) { return 0 <= y && y < _height }
	function width() { return _width }
	function height() { return _height }
	function isWall(x, y) {
		return !isValidX(x) || !isValidY(y) || walls[x][y]
	}

	return {
		isValidX,
		isValidY,
		width,
		height,
		isWall
	}
}

Terrain.optimizeCollisionData = terrainData => {
	//Wraps the terrain with 2 extra cells on each side
	//Inside border is wall, outside border is not
	//That removes edge cases for the algorithm

	const width = terrainData.width()+4
	const height = terrainData.height()+4

	const isWall = (x, y) => {
		if (x === 0 || x === width-1) return false
		if (y === 0 || y === height-1) return false
		if (x === 1 || x === width-2) return true
		if (y === 1 || y === height-2) return true
		return terrainData.isWall(x-2, y-2)
	}

	const collisionRectangles = []
	const xStart = new Array(height).fill(-1)
	const makeRectangle = (x, y, width, height) =>
		Rectangle(x-2, y-2, width, height)

	for (let x = 1; x < width-1; x++) {
		const endRectangle = new Array(height).fill(false)
		const xStartSet = {}
		for (let y = 0; y < height; y++) {
			if (!isWall(x-1, y) && isWall(x, y)) {
				xStart[y] = x
			} else if (!isWall(x, y)) {
				xStart[y] = width 
			}
			endRectangle[y] = isWall(x, y) && !isWall(x+1, y)
			if (endRectangle[y]) xStartSet[xStart[y]] = true
		}

		for (rectXStart in xStartSet) {
			let rectYStart = height
			for (let y = 0; y < height; y++) {
				if (rectYStart >= height && xStart[y] <= rectXStart) {
					rectYStart = y
				} else if (rectYStart < height && xStart[y] > rectXStart) {
					let isRectangeEnd = false
					for (let rangeY = rectYStart; rangeY < y; rangeY++) {
						if (endRectangle[rangeY]) {
							isRectangeEnd = true
							break
						}
					}
					if (isRectangeEnd) {
						collisionRectangles.push(makeRectangle(
								rectXStart,
								rectYStart,
								x-rectXStart+1,
								y-rectYStart)
						)
					}
					rectYStart = height
				}
			}
		}
	}
	return collisionRectangles
}

