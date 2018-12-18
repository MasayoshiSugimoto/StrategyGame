function Mouse(_worldProjection) {
	let _mouseX = 0
	let _mouseY = 0
	document.onmousemove = mouseEvent => {
		_mouseX = _worldProjection.pixelToMeter(mouseEvent.clientX)
		_mouseY = _worldProjection.pixelToMeter(mouseEvent.clientY)
	}

	function x() { return _mouseX }
	function y() { return _mouseY }

	return {x, y}
}
