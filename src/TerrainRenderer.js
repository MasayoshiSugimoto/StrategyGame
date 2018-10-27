function TerrainRenderer(_terrain, _worldProjection) {

	function render(canvas) {
		canvas.save()
		canvas.strokeStyle = "white"
		const left = 0.0
		const top = 0.0
		const right = _worldProjection.meterToPixel(_terrain.width())
		const bottom = _worldProjection.meterToPixel(_terrain.height())
		canvas.strokeRect(left, top, right, bottom)
		for (let x = 1; x < _terrain.width(); x++) {
			const screenX = _worldProjection.meterToPixel(x) 
			canvas.beginPath()
			canvas.moveTo(screenX, 0)
			canvas.lineTo(screenX, bottom)
			canvas.stroke()
		}
		for (let y = 1; y < _terrain.height(); y++) {
			const screenY = _worldProjection.meterToPixel(y) 
			canvas.beginPath()
			canvas.moveTo(0, screenY)
			canvas.lineTo(right, screenY)
			canvas.stroke()
		}
		canvas.restore()
	}

	function priority() { return RENDER_PRIORITY.TERRAIN }

	return {render, priority}
}