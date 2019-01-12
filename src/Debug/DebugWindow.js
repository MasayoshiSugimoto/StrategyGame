function DebugWindow(_initializer) {
	const _window = document.getElementById("debug")
	let _framePerSecond = 0

	const _framePerSecondSpan = document.createElement("span")
	_window.appendChild(_framePerSecondSpan)

	let _debugMode = "Normal Mode"

	{
		const _debugModeDropDown = DropDown(
			"debug_mode_drop_down",
			"Debug Mode",
			[
				{text: "Normal Mode", handler: setDebugMode},
				{text: "Debug Path Mode", handler: setDebugMode},
				{
					text: "Debug Collision Mode",
					handler: () => DebugCollision.enable(_initializer)
				},
			],
			0
		)
	}

	draw()

	function draw() {
		_framePerSecondSpan.innerText = `FPS: ${_framePerSecond}`
	}

	function setFramePerSecond(framePerSecond) {
		_framePerSecond = framePerSecond
		draw()
	}

	function setDebugMode(mode) {
		console.log(mode + " set")
		_debugMode = mode
	}

	function isDebugPathMode() { return _debugMode === "Debug Path Mode" }

	return {setFramePerSecond, isDebugPathMode}
}
