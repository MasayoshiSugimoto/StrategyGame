function Screen() {

	function setBackgroundColor(color) {
		_canvas.save()
		_canvas.fillStyle = color
		_canvas.fillRect(0, 0, _domElement.width, _domElement.height)
		_canvas.restore()
		return _instance
	}

	function fullScreen() {
		_domElement.width = window.innerWidth
		_domElement.height = window.innerHeight
		return _instance
	}

	function canvas() { return _canvas }

	function reset() {
		fullScreen()
		setBackgroundColor("black")
	}

	const _domElement = document.getElementById("screen")
	const _canvas = _domElement.getContext("2d")

	const _instance = {
		setBackgroundColor,
		fullScreen,
		canvas,
		reset
	}

	return _instance
}
