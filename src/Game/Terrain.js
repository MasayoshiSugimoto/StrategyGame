function Terrain(_terrainData) {

	const _height = _terrainData.split("\n").length - 2
	const _width = _terrainData.split("\n")[1].length

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

	function width() { return _width }
	function height() { return _height }

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

	function isValidX(x) { return 0 <= x && x < width() }
	function isValidY(y) { return 0 <= y && y < height() }

	function pathFinder() { return _pathFinder }

	function keepInside(vector) {
		return Vector2D(
			clamp(0, vector.x(), width()),
			clamp(0, vector.y(), height())
		)
	}

	function toCell(worldCoordinates) {
		const convertCoordinate = x =>
			Math.floor(x / Terrain.CELL_SIZE_METER)

		return Vector2D(
			convertCoordinate(clamp(0, worldCoordinates.x(), width()-1)),
			convertCoordinate(clamp(0, worldCoordinates.y(), height()-1))
		)
	}

	const instance = {
		width,
		height,
		isWall,
		forWalls,
		pathFinder,
		keepInside,
		toCell
	}

	const _pathFinder = PathFinder(instance)

	return instance
}

Terrain.CELL_SIZE_METER = 1

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

	return Terrain.checkCollisionData(collisionRectangles, terrainData)
}

Terrain.checkCollisionData = function(collisionRectangles, terrain) {
	for (let x = 0; x < terrain.width(); x++) {
		for (let y = 1; y < terrain.height(); y++) {
			if (terrain.isWall(x, y-1) && terrain.isWall(x,y)) {
				let isInsideRectangle = false
				for (let i = 0; i < collisionRectangles.length; i++) {
					if (collisionRectangles[i].isInsideExclusive(x+0.5, y)) {
						isInsideRectangle = true
						break;
					}
				}
				if (!isInsideRectangle) {
					alert("CollisionRectangles: data is wrong")
					throw "CollisionRectangles: data is wrong"
				}
			}
		}
	}

	for (let x = 1; x < terrain.width(); x++) {
		for (let y = 0; y < terrain.height(); y++) {
			if (terrain.isWall(x-1, y) && terrain.isWall(x,y)) {
				let isInsideRectangle = false
				for (let i = 0; i < collisionRectangles.length; i++) {
					if (collisionRectangles[i].isInsideExclusive(x, y+0.5)) {
						isInsideRectangle = true
						break;
					}
				}
				if (!isInsideRectangle) {
					alert("CollisionRectangles: data is wrong")
					throw "CollisionRectangles: data is wrong"
				}
			}
		}
	}
	return collisionRectangles
}

/*
 * This function keeps an actor outside of untraversable area
 */
Terrain.applyTerrainCollision = function(collisionRectangles, actor) {
	const position = actor.getPosition()
	collisionRectangles.forEach(rectangle => {
		const x = position.x()
		const y = position.y()

		const top = rectangle.y
		const bottom = rectangle.y+rectangle.height
		const left = rectangle.x
		const right = rectangle.x+rectangle.width

		if (left < x && x < right && top < y && y < bottom) {
			[
				{diff: x-left, f: () => actor.setPosition(Vector2D(left, y))},
				{diff: right-x, f: () => actor.setPosition(Vector2D(right, y))},
				{diff: y-top, f: () => actor.setPosition(Vector2D(x, top))},
				{diff: bottom-y, f: () => actor.setPosition(Vector2D(x, bottom))}
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
