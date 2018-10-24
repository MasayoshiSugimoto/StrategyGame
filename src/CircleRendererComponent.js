function CircleRendererComponent(_actor, _radius, _color) {
	function render(canvas) {
		const startAngle = 0.0
		const endAngle = 2 * Math.PI
		const worldFactor = 5

		canvas.save()
		canvas.fillStyle = _color
		canvas.arc(
			_actor.x() * worldFactor,
			_actor.y() * worldFactor,
			_radius,
			startAngle,
			endAngle 
		)
		canvas.closePath()
		canvas.fill()
		canvas.restore()
	}

	return {render}
}
