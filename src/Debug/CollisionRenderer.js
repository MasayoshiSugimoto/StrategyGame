function CollisionRenderer(canvas, worldProjection, collisionData) {

	const checkbox = document.getElementById("collision_data_view_checkbox")
	var enabled = checkbox.checked
	checkbox.onchange = () => enabled = checkbox.checked

	function render() {
		if (!enabled) return 

		canvas.save()
		canvas.strokeStyle = "green"

		collisionData
			.map(worldProjection.projectRectangleToScreen)
			.forEach(rectangle => {
				canvas.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
			})

		canvas.restore()
	}

	return {render}
}


