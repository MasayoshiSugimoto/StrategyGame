function DebugWindow() {
	const _window = document.getElementById("debug")
	let _framePerSecond = 0

	const _framePerSecondSpan = document.createElement("span")
	_window.appendChild(_framePerSecondSpan)

	draw()

	function draw() {
		_framePerSecondSpan.innerText = `FPS: ${_framePerSecond}`
	}

	function setFramePerSecond(framePerSecond) {
		_framePerSecond = framePerSecond
		draw()
	}

	return {setFramePerSecond}
}
