function CircleRendererComponent(_actor, _radius, _color, _worldProjection) {
	function render(canvas) {
		const startAngle = 0.0
		const endAngle = 2 * Math.PI

		canvas.save()
		canvas.fillStyle = _color
		canvas.beginPath()
		canvas.arc(
			_worldProjection.meterToPixel(_actor.x()),
			_worldProjection.meterToPixel(_actor.y()),
			_radius,
			startAngle,
			endAngle 
		)
		canvas.fill()
		canvas.restore()
	}

	function priority() { return RENDER_PRIORITY.GAME }

	return {render, priority}
}

function renderCircleComponents(actors, canvas) {
	actors.forEach(actor => {
		const circleRendererComponent = actor.getComponent(ActorComponentId.CIRCLE_RENDERER)
		if (circleRendererComponent !== undefined) circleRendererComponent.render(canvas)
	})
}