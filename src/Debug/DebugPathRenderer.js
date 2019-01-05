function DebugPath(
	_canvas,
	_worldProjection,
	_terrain,
	_mouse,
	_debugWindow
) {

	let _start = Vector2D.ZERO
	let _end = Vector2D.ZERO
	const _pathFinder = PathFinder(_terrain)

	document.addEventListener("click", () => {
		_start = _terrain.toCell(_mouse)
	})

	function isEnabled() {
		return _debugWindow.isDebugPathMode()
	}

	function update() {
		if (!isEnabled()) return
		_end = _terrain.toCell(_mouse)
	}

	function render() {
		if (!isEnabled()) return

		_canvas.save()
		_canvas.fillStyle = "red"
		{
			const topLeftCorner = _worldProjection.toScreenCoordinates(_end)
			_canvas.fillRect(
				topLeftCorner.x(),
				topLeftCorner.y(),
				WorldProjection.PIXELS_PER_METER * Terrain.CELL_SIZE_METER,
				WorldProjection.PIXELS_PER_METER * Terrain.CELL_SIZE_METER
			)
		}
		_canvas.fillStyle = "green"
		{
			const topLeftCorner = _worldProjection.toScreenCoordinates(_start)
			_canvas.fillRect(
				topLeftCorner.x(),
				topLeftCorner.y(),
				WorldProjection.PIXELS_PER_METER * Terrain.CELL_SIZE_METER,
				WorldProjection.PIXELS_PER_METER * Terrain.CELL_SIZE_METER
			)
		}

		const start = {x: _start.x(), y: _start.y()}
		const end = {x: _end.x(), y: _end.y()}
		const path = _pathFinder.findPath(start, end)
		path.forEach(node => {
			const topLeftCorner = _worldProjection.toScreenCoordinates(node)
			_canvas.fillRect(
				topLeftCorner.x(),
				topLeftCorner.y(),
				WorldProjection.PIXELS_PER_METER * Terrain.CELL_SIZE_METER,
				WorldProjection.PIXELS_PER_METER * Terrain.CELL_SIZE_METER
			)
		})
		_canvas.restore()
	}

	function benchmark() {
		const randomCell = () => ({
			x: Math.floor(Math.random() * _terrain.width()),
			y: Math.floor(Math.random() * _terrain.height())
		})
		const stopWatch = StopWatch()
		for (let i = 0; i < 1000; i++) {
			_pathFinder.findPath(randomCell(), randomCell())
		}
		console.log("Path Finding Benchmark: " + stopWatch.lap())
	}

	benchmark()

	return {
		update,
		render
	}
}
