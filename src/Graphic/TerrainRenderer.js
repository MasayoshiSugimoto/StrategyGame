function TerrainRenderer(_terrain, _worldProjection, _canvas) {

	const CELL_SIZE = WorldProjection.PIXELS_PER_METER * 1

	function render() {
		_canvas.save()
		_canvas.strokeStyle = "white"
		_canvas.fillStyle = "white"
		const left = 0.0
		const top = 0.0
		const right = _worldProjection.meterToPixel(_terrain.width())
		const bottom = _worldProjection.meterToPixel(_terrain.height())
		_canvas.strokeRect(left, top, right, bottom)
		for (let x = 1; x < _terrain.width(); x++) {
			const screenX = _worldProjection.meterToPixel(x) 
			_canvas.beginPath()
			_canvas.moveTo(screenX, 0)
			_canvas.lineTo(screenX, bottom)
			_canvas.stroke()
		}
		for (let y = 1; y < _terrain.height(); y++) {
			const screenY = _worldProjection.meterToPixel(y) 
			_canvas.beginPath()
			_canvas.moveTo(0, screenY)
			_canvas.lineTo(right, screenY)
			_canvas.stroke()
		}
		_terrain.forWalls((x, y, isTraversable) => {
			if (isTraversable) return
			_canvas.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE)
		})
		_canvas.restore()
	}

	function priority() { return RENDER_PRIORITY.TERRAIN }

	return {render, priority}
}
