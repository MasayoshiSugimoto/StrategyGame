function DebugPath(_canvas, _worldProjection, _terrain, _mouse) {

	let _start = Vector2D.ZERO
	let _end = Vector2D.ZERO
	const _pathFinder = PathFinder(_terrain)

	document.addEventListener("click", () => {
		_start = _terrain.toCell(_mouse)
	})

	function update() {
		_end = _terrain.toCell(_mouse)
	}

	function render() {
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

	return {
		update,
		render
	}
}
