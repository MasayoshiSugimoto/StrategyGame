function HPBarRendererComponent(_actor, _healthComponent, _worldCoordinates) {
	function render(canvas) {
		const x = _worldCoordinates.meterToPixel(_actor.x()) - (HPBarRendererComponent.WIDTH / 2)
		const y = _worldCoordinates.meterToPixel(_actor.y()) + HPBarRendererComponent.Y_OFFSET

		canvas.save()
		canvas.fillStyle = "green"
		canvas.fillRect(
			x,
			y,
			HPBarRendererComponent.WIDTH,
			HPBarRendererComponent.HEIGHT
		)
		canvas.restore()
	}

	return {render}
}

HPBarRendererComponent.WIDTH = 25
HPBarRendererComponent.HEIGHT = 5
HPBarRendererComponent.Y_OFFSET = -20
