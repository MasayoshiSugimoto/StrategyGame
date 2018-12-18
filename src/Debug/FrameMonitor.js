function FrameMonitor(_debugWindow) {
	let _frameCounter = 0
	let _timeFromStartMillisecond = 0

	function onFrameDone(deltaTimeMillisecond) {
		_timeFromStartMillisecond += deltaTimeMillisecond
		_frameCounter++
		if (_timeFromStartMillisecond >= 1000.0) {
			_debugWindow.setFramePerSecond(_frameCounter)
			_frameCounter = 0
			_timeFromStartMillisecond = _timeFromStartMillisecond - 1000.0
		}
	}

	return {onFrameDone}
}
